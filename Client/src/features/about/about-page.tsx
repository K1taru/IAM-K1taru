import Image from 'next/image'
import Link from 'next/link'
import { about, leadership, milestones } from '@content/about'
import { person, profile } from '@content/profile'
import { capabilities } from '@content/skills'
import { ContactLinks } from '@/components/contact-links'
import { PageMotion } from '@/components/page-motion'
import { SectionLayout } from '@/components/section-layout'
import { SkillList } from '@/components/skill-list'
import { getProjects } from '@/features/projects/project-content'
import { projectPath } from '@/features/projects/project-paths'

const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'tools', label: 'Skills' },
  { id: 'roadmap', label: 'Interests' },
  { id: 'contact', label: 'Contact' },
]

export function AboutPage() {
  const publishedSlugs = new Set(getProjects().map((project) => project.slug))

  return (
    <PageMotion>
      <header className="page-intro grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_10rem] sm:gap-10 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div>
          <h1 className="page-title">About me</h1>
          <p className="page-lede">
            I’m {person.name}, based in the {person.location}. {about.intro}
          </p>
        </div>
        <Image
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={profile.portrait.width}
          height={profile.portrait.height}
          unoptimized
          className="profile-image h-auto w-32 max-w-full rounded-2xl border border-divider bg-surface sm:w-full"
        />
      </header>

      <SectionLayout label="On this page" sections={sections}>
        <div className="grid gap-5 pb-[var(--section-space)]">
          <section id="experience" className="panel-frame panel-pad grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10" aria-labelledby="experience-title" data-reveal="">
            <div>
              <span id="certifications" aria-hidden="true" className="block" />
              <h2 id="experience-title" className="section-title">Experience</h2>
            </div>
            <div className="max-w-[var(--prose-width)]">
              <h3 className="text-xl font-semibold">Education</h3>
              <p className="mt-2 leading-relaxed text-muted">
                {person.education}
              </p>
              <h3 className="mt-8 text-xl font-semibold">Project milestones</h3>
              <ol className="mt-4 divide-y divide-divider border-y border-divider">
                {milestones.map(({ year, summary }, index) => (
                  <li key={year} className="grid gap-2 py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
                    <time dateTime={String(year)} className={index === 0 ? 'panel-label' : 'font-semibold text-ink'}>{year}</time>
                    <p className="leading-relaxed text-muted">
                      {summary.map((part, partIndex) => {
                        if (typeof part === 'string') return part
                        if (!publishedSlugs.has(part.slug)) return part.label
                        return (
                          <Link key={partIndex} href={projectPath(part.slug)} className="font-medium text-accent underline underline-offset-4">
                            {part.label}
                          </Link>
                        )
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="leadership" className="panel-frame panel-pad grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10" aria-labelledby="leadership-title" data-reveal="">
            <h2 id="leadership-title" className="section-title">Leadership</h2>
            <ul className="max-w-[var(--prose-width)] space-y-4">
              {leadership.map(({ title, details }) => (
                <li key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-muted">{details}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="tools" className="py-4" aria-labelledby="tools-title">
            <h2 id="tools-title" className="section-title" data-reveal="0">Skills and tools</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {capabilities.map(({ label, description, skills }, index) => (
                <div key={label} className="panel-frame panel-pad" data-reveal={index}>
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{description}</p>
                  <SkillList skills={skills} label={label} />
                </div>
              ))}
            </div>
          </section>

          <section id="roadmap" className="panel-frame panel-pad grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10" aria-labelledby="interests-title" data-reveal="">
            <h2 id="interests-title" className="section-title">What I’m interested in</h2>
            <p className="max-w-[var(--prose-width)] self-center leading-relaxed text-muted">
              {about.interests}
            </p>
          </section>

          <section id="contact" className="panel-frame panel-pad grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10" aria-labelledby="contact-title" data-reveal="">
            <h2 id="contact-title" className="section-title">Contact</h2>
            <div className="self-center">
              <p className="mb-2 leading-relaxed text-muted">Message me on LinkedIn or browse my code on GitHub.</p>
              <ContactLinks />
            </div>
          </section>
        </div>
      </SectionLayout>
    </PageMotion>
  )
}
