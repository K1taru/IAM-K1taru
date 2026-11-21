import * as THREE from 'three'
import { ArcballControls } from 'three/addons/controls/ArcballControls.js'

function buildCore() {
  const core = new THREE.Group()
  const lines: number[] = []
  const colors: number[] = []
  const dots: number[] = []
  const palette = [0x267d83, 0x38aaa9, 0x5adcc8, 0xb3ffe9, 0xeab880].map((hex) => new THREE.Color(hex))
  let seed = 97
  const random = () => ((seed = seed * 16807 % 2147483647) / 2147483647)
  function wire(a: THREE.Vector3, b: THREE.Vector3, tone: number) {
    lines.push(...a.toArray(), ...b.toArray())
    const color = palette[tone].toArray()
    colors.push(...color, ...color)
  }

  // Short traces turn at right angles along each spherical shell.
  for (let i = 0; i < 560; i++) {
    const radius = 0.66 + 0.53 * random()
    let polar = Math.acos(2 * random() - 1)
    let angle = random() * Math.PI * 2
    const point = () => new THREE.Vector3().setFromSphericalCoords(radius, polar, angle)
    let from = point()
    const tone = random() < 0.06 ? 4 : Math.floor(random() * 4)
    for (let j = 0; j < 7; j++) {
      if (j === 4) polar += 0.04
      else angle += 0.045
      const to = point()
      wire(from, to, tone)
      from = to
    }
    dots.push(...from.toArray())
  }

  for (let ring = 0; ring < 13; ring++) {
    const radius = 0.24 + ring * 0.078
    const tilt = new THREE.Euler(random() * 0.9, random() * 0.95, random() * Math.PI)
    const ringPoint = (angle: number, r: number) => new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), 0).applyEuler(tilt)
    for (let i = 0; i < 120; i++) {
      if ((i + ring * 3) % 29 < 5) continue
      const angle = Math.PI * i / 60
      wire(ringPoint(angle, radius), ringPoint(angle + Math.PI / 60, radius), ring % 4)
      if (i % 4 === 0) wire(ringPoint(angle, radius), ringPoint(angle, radius + 0.035), 2)
    }
  }

  // Flat, interrupted bands catch the light between the hairline traces.
  const panels: number[] = []
  for (let layer = 0; layer < 8; layer++) {
    const radius = 0.2 + layer * 0.133
    const tilt = new THREE.Euler(layer * 0.21, Math.sin(layer) * 0.8, layer * 0.4)
    const edge = (angle: number, width: number) => new THREE.Vector3(
      (radius + width) * Math.cos(angle), (radius + width) * Math.sin(angle), 0,
    ).applyEuler(tilt)
    for (let i = 0; i < 96; i++) {
      if ((i + layer * 9) % 24 > 14 || i % 7 === 0) continue
      const a = Math.PI * i / 48
      const b = a + Math.PI / 50
      const width = i % 4 === 0 ? 0.032 : 0.017
      const vertices = [edge(a, 0), edge(b, 0), edge(a, width), edge(a, width), edge(b, 0), edge(b, width)]
      for (const vertex of vertices) panels.push(...vertex.toArray())
    }
  }
  const bands = new THREE.BufferGeometry()
  bands.setAttribute('position', new THREE.Float32BufferAttribute(panels, 3))
  const rings = new THREE.Mesh(bands, new THREE.MeshBasicMaterial({
    color: 0x78ebd8, side: THREE.DoubleSide, transparent: true, opacity: 0.66,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  core.add(rings)

  const traces = new THREE.BufferGeometry()
  traces.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))
  traces.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  core.add(new THREE.LineSegments(traces, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.72 })))
  const nodes = new THREE.BufferGeometry()
  nodes.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3))
  core.add(new THREE.Points(nodes, new THREE.PointsMaterial({ color: 0xb7ffed, size: 0.017 })))
  const nucleus = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 1), new THREE.MeshBasicMaterial({ color: 0xc2ffee, wireframe: true }))
  core.add(nucleus)

  const glow = document.createElement('canvas')
  glow.width = glow.height = 128
  const ctx = glow.getContext('2d')
  let halo: THREE.Sprite | undefined
  if (ctx) {
    const fill = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    fill.addColorStop(0, '#edfffc')
    fill.addColorStop(0.11, '#97fee1')
    fill.addColorStop(0.28, 'rgba(48,220,187,0.55)')
    fill.addColorStop(1, 'rgba(30,150,136,0)')
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, 128, 128)
    halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(glow), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
    }))
    halo.scale.setScalar(1.15)
    core.add(halo)
  }
  return { core, rings, nucleus, halo }
}

function release(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points || child instanceof THREE.Sprite)) return
    if (!(child instanceof THREE.Sprite)) child.geometry.dispose()
    for (const material of [child.material].flat()) {
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose()
      material.dispose()
    }
  })
}

export function mountCore(canvas: HTMLCanvasElement, model: string | undefined, onReady: (content: 'core' | 'model') => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100)
  camera.position.set(0, 0, 4.2)
  const pivot = new THREE.Group()
  const { core, rings, nucleus, halo } = buildCore()
  pivot.add(core)
  core.visible = !model
  scene.add(pivot)
  const controls = new ArcballControls(camera, canvas)
  controls.enablePan = false
  controls.enableZoom = false
  controls.enableFocus = false
  controls.enableAnimations = false
  controls.setGizmosVisible(false)
  let disposed = false
  let content: 'core' | 'model' | null = model ? null : 'core'
  let sizeReady = false
  let announced = false
  let rotatingModel: THREE.Group | undefined
  function render() {
    if (disposed || !sizeReady || !content) return
    renderer.render(scene, camera)
    if (!announced) {
      announced = true
      onReady(content)
    }
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let inView = false
  let dragging = false
  let frame = 0
  let lastFrame = 0
  let elapsed = 0
  function animate(now: number) {
    frame = 0
    if (!shouldAnimate()) {
      lastFrame = 0
      return
    }
    frame = requestAnimationFrame(animate)
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0
    lastFrame = now
    if (dragging) return
    elapsed += delta
    if (rotatingModel) rotatingModel.rotation.y = elapsed * 0.32
    core.rotation.y = elapsed * 0.36
    core.rotation.x = 0.15 * Math.sin(elapsed * 0.55)
    core.position.y = 0.06 * Math.sin(elapsed * 1.25)
    rings.rotation.z = -elapsed * 0.53
    rings.material.opacity = 0.58 + 0.09 * Math.sin(elapsed * 2.2)
    nucleus.rotation.set(elapsed * 0.85, -elapsed * 0.7, 0)
    if (halo) halo.scale.setScalar(1.15 + 0.16 * Math.sin(elapsed * 2.2))
    render()
  }

  function shouldAnimate() {
    return inView && !document.hidden && !reducedMotion.matches && content !== null
  }

  function syncAnimation() {
    const playing = shouldAnimate()
    if (playing && !frame) frame = requestAnimationFrame(animate)
    if (!playing) {
      cancelAnimationFrame(frame)
      frame = 0
      lastFrame = 0
    }
  }

  const startDrag = () => { dragging = true }
  const endDrag = () => { dragging = false }
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    syncAnimation()
  })
  visibility.observe(canvas)
  reducedMotion.addEventListener('change', syncAnimation)
  document.addEventListener('visibilitychange', syncAnimation)
  controls.addEventListener('start', startDrag)
  controls.addEventListener('end', endDrag)
  function resize() {
    const { width, height } = canvas.getBoundingClientRect()
    if (!width || !height) return
    camera.aspect = width / height
    camera.zoom = Math.min(1, camera.aspect)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    sizeReady = true
    render()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  controls.addEventListener('change', render)
  resize()

  if (model) {
    void import('three/addons/loaders/GLTFLoader.js').then(async ({ GLTFLoader }) => {
      if (disposed) return
      const { scene: asset } = await new GLTFLoader().loadAsync(model)
      const box = new THREE.Box3().setFromObject(asset)
      const span = Math.max(...box.getSize(new THREE.Vector3()).toArray())
      if (disposed) { release(asset); return }
      if (!Number.isFinite(span) || span <= 0) {
        release(asset)
        throw new Error('Project model has no visible bounds.')
      }
      const wrapper = new THREE.Group()
      asset.position.sub(box.getCenter(new THREE.Vector3()))
      wrapper.add(asset)
      wrapper.scale.setScalar(2 / span)
      rotatingModel = wrapper
      pivot.add(wrapper)
      scene.add(new THREE.HemisphereLight(0xffffff, 0x83b2a9, 2))
      const light = new THREE.DirectionalLight(0xffffff, 2)
      light.position.set(2, 3, 4)
      scene.add(light)
      content = 'model'
      render()
      syncAnimation()
    }).catch(() => {
      if (disposed) return
      core.visible = true
      content = 'core'
      render()
      syncAnimation()
    })
  }

  return {
    rotate(x: number, y: number) {
      const axis = new THREE.Vector3(y, x, 0).applyQuaternion(camera.quaternion).normalize()
      pivot.rotateOnWorldAxis(axis, Math.PI / 12)
      render()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      visibility.disconnect()
      reducedMotion.removeEventListener('change', syncAnimation)
      document.removeEventListener('visibilitychange', syncAnimation)
      observer.disconnect()
      controls.removeEventListener('change', render)
      controls.dispose()
      release(pivot)
      renderer.dispose()
    },
  }
}
