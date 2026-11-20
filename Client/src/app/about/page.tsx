import Link from 'next/link'
import { ContactLinks } from '@/components/contact-links'
import { capabilities, person } from '@/lib/portfolio'
import { getProjects } from '@/lib/projects'
import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata('/about/', 'About', 'Education, project experience, and contact information for John Michael Garcia.')

const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'tools', label: 'Tools' },
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
    <>
      <header className="page-intro">
        <h1 className="page-title">About me</h1>
        <p className="page-lede">
          I’m John Michael Garcia, a software developer based in the {person.location}.
          I like working on the whole system, from the app people use to the machine it runs on.
        </p>
      </header>

      <nav aria-label="On this page" className="border-y border-divider py-2">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {sections.map(({ id, label }) => (
            <li key={id}><a className="text-link" href={`#${id}`}>{label}</a></li>
          ))}
        </ul>
      </nav>

      <div className="divide-y divide-divider pb-[var(--section-space)]">
        <section id="experience" className="grid gap-6 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:py-14" aria-labelledby="experience-title">
          <div>
            <span id="certifications" aria-hidden="true" className="block" />
            <h2 id="experience-title" className="section-title">Experience</h2>
          </div>
          <div className="max-w-[65ch]">
            <h3 className="text-xl font-semibold">Education</h3>
            <p className="mt-2 leading-relaxed text-muted">
              I studied computer engineering with a specialization in data science at the Technological Institute of the Philippines.
            </p>
            <h3 className="mt-8 text-xl font-semibold">Project milestones</h3>
            <ol className="mt-4 divide-y divide-divider border-y border-divider">
              <li className="grid gap-2 py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
                <time dateTime="2026" className="font-semibold text-ink">2026</time>
                <p className="leading-relaxed text-muted">
                  Built {projectLink('gymms', 'GyMMS')} and {projectLink('pi-monitor', 'Pi Monitor')} for Raspberry Pi, worked on computer vision for {projectLink('moskita', 'MosKita')}, and contributed to the {projectLink('mdsystem', 'MDSystem')} team.
                </p>
              </li>
              <li className="grid gap-2 py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
                <time dateTime="2025" className="font-semibold text-ink">2025</time>
                <p className="leading-relaxed text-muted">
                  Built a repeatable PyTorch training and evaluation workflow for the {projectLink('traffic-sign-classifier', 'Traffic Sign Classifier')}.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section id="tools" className="py-10 md:py-14" aria-labelledby="tools-title">
          <h2 id="tools-title" className="section-title">Tools I use</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {capabilities.map(({ label, description, skills }) => (
              <div key={label} className="rounded-2xl border border-divider bg-surface p-5">
                <h3 className="text-lg font-semibold">{label}</h3>
                <p className="mt-2 leading-relaxed text-muted">{description}</p>
                <ul aria-label={`Tools for ${label.toLowerCase()}`} className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <li key={skill} className="rounded-md border border-divider px-2.5 py-1 text-sm text-ink">{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="roadmap" className="grid gap-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:py-14" aria-labelledby="interests-title">
          <h2 id="interests-title" className="section-title">What I’m interested in</h2>
          <p className="max-w-[65ch] self-center leading-relaxed text-muted">
            I’m interested in full-stack work and the engineering around machine learning. I’d like to get better at evaluating models, running them on small devices, and keeping those systems reliable once they’re deployed.
          </p>
        </section>

        <section id="contact" className="grid gap-3 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:py-14" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section-title">Contact</h2>
          <div className="self-center">
            <p className="mb-2 leading-relaxed text-muted">Message me on LinkedIn or browse my code on GitHub.</p>
            <ContactLinks />
          </div>
        </section>
      </div>
    </>
  )
}
