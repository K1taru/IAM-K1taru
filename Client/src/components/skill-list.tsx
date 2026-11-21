import {
  siArduino, siDjango, siDocker, siEspressif, siFlask, siGithubactions, siLinux,
  siNodedotjs, siOnnx, siPostgresql, siPython, siPytorch, siRaspberrypi,
  siReact, siTypescript, siYolo, type SimpleIcon,
} from 'simple-icons'

const logos: Record<string, SimpleIcon> = {
  TypeScript: siTypescript, React: siReact, Django: siDjango, Flask: siFlask,
  'Node.js': siNodedotjs, PostgreSQL: siPostgresql, Python: siPython, PyTorch: siPytorch,
  YOLO: siYolo, ONNX: siOnnx, Linux: siLinux, Docker: siDocker,
  'GitHub Actions': siGithubactions, 'Raspberry Pi 5': siRaspberrypi, ESP32: siEspressif, Arduino: siArduino,
}

export function SkillList({ skills, label }: { skills: string[], label: string }) {
  return (
    <ul aria-label={`Tools for ${label.toLowerCase()}`} className="mt-4 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li key={skill} className="skill-chip inline-flex items-center gap-2 rounded-md border border-divider px-2.5 py-1.5 text-sm text-ink">
          {logos[skill] && <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 fill-current text-accent"><path d={logos[skill].path} /></svg>}
          {skill}
        </li>
      ))}
    </ul>
  )
}
