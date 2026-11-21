export const projectsPath = '/projects/'

export function projectPath(slug: string) {
  return `${projectsPath}${slug}/`
}

export function projectNotePath(slug: string, noteSlug: string) {
  return `${projectPath(slug)}docs/${noteSlug}/`
}
