import { credentialGroups } from '@content/certifications'
import { PageMotion } from '@/components/page-motion'
import { SectionLayout } from '@/components/section-layout'
import { CertificateCard } from './certificate-card'
import { getCertificateImage } from './certificate-image'

export function CertificationsPage() {
  return (
    <PageMotion>
      <header className="page-intro">
        <h1 className="page-title">Certifications</h1>
        <p className="page-lede">Courses I’ve completed, academic honors I’ve received, and events I’ve taken part in.</p>
      </header>

      <SectionLayout label="Certificate categories" sections={credentialGroups.map(({ id, title }) => ({ id, label: title }))}>
        <div className="divide-y divide-divider pb-[var(--section-space)]">
          {credentialGroups.map(({ id, title, credentials }, index) => (
            <section key={id} id={id} aria-labelledby={`${id}-title`} className="py-10 md:py-14">
              <h2 id={`${id}-title`} className="section-title" data-reveal={index % 4}>{title}</h2>
              <ul className="credential-grid mt-6">
                {credentials.map(({ slug, title, issuer, date }, cardIndex) => {
                  return (
                    <li key={slug} className="min-w-0" data-reveal={cardIndex % 4}>
                      <CertificateCard file={getCertificateImage(slug)} slug={slug} title={title} issuer={issuer} date={date} />
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </SectionLayout>
    </PageMotion>
  )
}
