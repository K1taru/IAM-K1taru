import { statSync } from 'node:fs'
import path from 'node:path'

export function getCertificateImage(slug: string) {
  const file = `/media/certifications/${slug}.webp`
  return statSync(path.join(process.cwd(), 'public', file), { throwIfNoEntry: false })?.isFile() ? file : undefined
}
