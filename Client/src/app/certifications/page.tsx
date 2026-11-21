import Image from 'next/image'
import { DirectionIcon } from '@/components/direction-icon'
import { pageMetadata } from '@/lib/site'
import { credentialGroups } from './credentials'

export const metadata = pageMetadata(
  '/certifications/',
  'Certifications',
  'Course certificates, academic honors, and event participation by John Michael Garcia.',
)

export default function CertificationsPage() {
  return (
    <>
      <header className="page-intro">
        <h1 className="page-title">Certifications</h1>
        <p className="page-lede">Courses I’ve completed, academic honors I’ve received, and events I’ve taken part in.</p>
      </header>

      <nav aria-label="Certificate categories" className="border-y border-divider py-2">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {credentialGroups.map(({ id, title }) => (
            <li key={id}><a className="text-link" href={`#${id}`}>{title}</a></li>
          ))}
        </ul>
      </nav>

      <div className="divide-y divide-divider pb-[var(--section-space)]">
        {credentialGroups.map(({ id, title, credentials }) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`} className="py-10 md:py-14">
            <h2 id={`${id}-title`} className="section-title">{title}</h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {credentials.map(({ slug, title, issuer, date }) => {
                const file = `/media/certifications/${slug}.webp`
                return (
                  <li key={slug} className="min-w-0">
                    <article className="flex h-full flex-col rounded-2xl border border-divider bg-surface">
                      <div className="relative aspect-[16/10] w-full rounded-t-2xl border-b border-divider bg-canvas">
                        <Image src={file} alt="" fill unoptimized className="object-contain p-3" />
                      </div>
                      <div className="flex flex-1 flex-col items-start p-5">
                        <h3 className="text-lg leading-snug font-semibold">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{issuer}</p>
                        <p className="mb-3 text-sm leading-relaxed text-muted">{date}</p>
                        <a href={file} className="text-link mt-auto">
                          View certificate<span className="sr-only"> for {title}</span> <DirectionIcon />
                        </a>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
