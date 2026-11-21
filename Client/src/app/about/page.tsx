import { SkillList } from '@/components/skill-list'
import Image from 'next/image'
import { PageMotion } from '@/components/page-motion'
import { SectionLayout } from '@/components/section-layout'
import Link from 'next/link'
import { ContactLinks } from '@/components/contact-links'
import { capabilities, person } from '@/lib/portfolio'
import { getProjects } from '@/lib/projects'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata('/about/', 'About', 'John Michael Garcia’s education, project experience, and student leadership at T.I.P. Manila.')

const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'tools', label: 'Skills' },
  { id: 'roadmap', label: 'Interests' },
  { id: 'contact', label: 'Contact' },
]

export default function AboutPage() {
  const publishedSlugs = new Set(getProjects().map((project) => project.slug))

  function projectLink(slug: string, label: string) {
    if (!publishedSlugs.has(slug)) return label
    return <Link href={`/projects/${slug}/`} className="font-medium text-accent underline underline-offset-4">{label}</Link>
  }

  return (
    <PageMotion>
      <header className="page-intro grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_10rem] sm:gap-10 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div>
          <h1 className="page-title">About me</h1>
          <p className="page-lede">
            I’m John Michael Garcia, a computer engineering student in the {person.location}.
            I’ve led frontend work on team projects and built full-stack apps, AI assistants, and computer vision tools.
          </p>
        </div>
        <Image
          src="/media/profile.webp"
          alt="John Michael Garcia in formal business attire"
          width={480}
          height={480}
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
            <div className="max-w-[65ch]">
              <h3 className="text-xl font-semibold">Education</h3>
              <p className="mt-2 leading-relaxed text-muted">
                I’m pursuing a B.S. in Computer Engineering with a specialization in Data Science at the Technological Institute of the Philippines in Manila. I started in 2023.
              </p>
              <h3 className="mt-8 text-xl font-semibold">Project milestones</h3>
              <ol className="mt-4 divide-y divide-divider border-y border-divider">
                <li className="grid gap-2 py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
                  <time dateTime="2026" className="panel-label">2026</time>
                  <p className="leading-relaxed text-muted">
                    Led frontend work on {projectLink('mdsystem', 'MDSystem')}, researched and developed {projectLink('moskita', 'MosKita')}, and built {projectLink('pi-monitor', 'Pi Monitor')}. I also worked on the frontend and document retrieval for MARIO at the Grundfos Data & AI Inclusion Hackathon.
                  </p>
                </li>
                <li className="grid gap-2 py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
                  <time dateTime="2025" className="font-semibold text-ink">2025</time>
                  <p className="leading-relaxed text-muted">
                    Built {projectLink('gymms', 'GyMMS')} for a gym client, led frontend work on {projectLink('cookeat', 'CookEat')}, and wrote smart contracts for {projectLink('growquest', 'GrowQuest')}.
                  </p>
                </li>
              </ol>
            </div>
          </section>

          <section id="leadership" className="panel-frame panel-pad grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10" aria-labelledby="leadership-title" data-reveal="">
            <h2 id="leadership-title" className="section-title">Leadership</h2>
            <ul className="max-w-[65ch] space-y-4">
              <li>
                <h3 className="font-semibold">Treasurer, UGNAY</h3>
                <p className="mt-1 text-muted">T.I.P. Manila Career Center, 2026–present</p>
              </li>
              <li>
                <h3 className="font-semibold">Event host, Co-Work, Co-Exist</h3>
                <p className="mt-1 text-muted">T.I.P. Manila Career Center with Alliance Software, October 2026</p>
              </li>
              <li>
                <h3 className="font-semibold">Treasurer, Computer Engineering Department Student Council</h3>
                <p className="mt-1 text-muted">T.I.P. Manila, academic year 2024–2025</p>
              </li>
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
            <p className="max-w-[65ch] self-center leading-relaxed text-muted">
              I’m interested in computer vision, edge AI, embedded systems, and competitive robotics. I like working on projects that bring software and hardware together.
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
