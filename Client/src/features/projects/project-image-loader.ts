import type { ImageLoaderProps } from 'next/image'

const widths = [160, 320, 640, 960, 1440]

export function projectImageLoader(intrinsicWidth?: number) {
  return ({ src, width }: ImageLoaderProps) => {
    const variant = widths.find((candidate) => candidate >= width && candidate < (intrinsicWidth ?? 0))
    return variant ? src.replace(/\.webp$/, `-${variant}.webp`) : src
  }
}
