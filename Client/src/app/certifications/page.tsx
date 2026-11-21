import { person } from '@content/profile'
import { CertificationsPage } from '@/features/certifications/certifications-page'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata(
  '/certifications/',
  'Certifications',
  `Course certificates, academic honors, and event participation by ${person.name}.`,
)

export default CertificationsPage
