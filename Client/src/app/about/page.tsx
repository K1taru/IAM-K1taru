import { person } from '@content/profile'
import { AboutPage } from '@/features/about/about-page'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata('/about/', 'About', `${person.name}’s engineering projects, technical background, and leadership experience.`)

export default AboutPage
