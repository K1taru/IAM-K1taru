export const projectDomains = {
  applications: 'Applications',
  'machine-learning': 'Machine learning',
  infrastructure: 'Infrastructure',
  'data-systems': 'Data systems',
  other: 'Other',
}

type ProjectDomain = keyof typeof projectDomains
export const projectDomainIds = Object.keys(projectDomains) as ProjectDomain[]
