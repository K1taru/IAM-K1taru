import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { canonical } from '@/lib/site'
import { getProjects } from '@/lib/projects'

export const metadata: Metadata = { title: 'About', alternates: canonical('/about/') }

const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'roadmap', label: 'Roadmap' },
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
      <header className="grid items-center gap-6 pt-10 pb-8 sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-12 sm:pt-16 sm:pb-10">
        <div>
          <h1 className="page-title">About</h1>
          <p className="mt-5 max-w-[68ch] leading-relaxed text-muted sm:text-lg">
            I’m John Michael Garcia. My background is in computer engineering and data science. I build and self-host software, from computer vision on edge devices to the tools I use to run those systems.
          </p>
        </div>
        <Image
          src="/media/profile.webp"
          width={480}
          height={480}
          alt="John Michael Garcia"
          unoptimized
          className="h-auto w-32 rounded-lg border border-divider sm:w-full"
        />
      </header>

      <nav aria-label="On this page" className="border-y border-divider py-2">
        <ul className="flex flex-wrap gap-x-5 sm:gap-x-8">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-[68ch] divide-y divide-divider pb-12 sm:pb-20">
        <section id="experience" className="scroll-mt-4 py-8 sm:py-10">
          <h2 className="font-display text-4xl tracking-tight">Experience</h2>
          <p className="mt-4 leading-relaxed text-muted">
            I studied Computer Engineering, specializing in Data Science, at the Technological Institute of the Philippines.
          </p>
          <ol className="mt-5 grid gap-4">
            <li className="grid gap-1 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
              <time dateTime="2026" className="font-mono text-sm text-muted">2026</time>
              <p className="leading-relaxed text-muted">
                Built {projectLink('pi-monitor', 'Pi Monitor')} for my self-hosted services and worked on edge computer vision for {projectLink('moskita', 'MosKita')}.
              </p>
            </li>
            <li className="grid gap-1 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
              <time dateTime="2025" className="font-mono text-sm text-muted">2025</time>
              <p className="leading-relaxed text-muted">
                Built a reproducible PyTorch workflow for a {projectLink('traffic-sign-classifier', 'Traffic Sign Classifier')}.
              </p>
            </li>
          </ol>
        </section>

        <section id="certifications" className="scroll-mt-4 py-8 sm:py-10">
          <h2 className="font-display text-4xl tracking-tight">Certifications</h2>
          <p className="mt-4 leading-relaxed text-muted">No certifications listed yet.</p>
        </section>

        <section id="roadmap" className="scroll-mt-4 py-8 sm:py-10">
          <h2 className="font-display text-4xl tracking-tight">Roadmap</h2>
          <dl className="mt-4 space-y-4 leading-relaxed">
            <div>
              <dt className="font-semibold">Technical direction</dt>
              <dd className="mt-1 text-muted">I want to deepen my work in model evaluation, edge inference, and operating the software around machine learning models.</dd>
            </div>
            <div>
              <dt className="font-semibold">Career direction</dt>
              <dd className="mt-1 text-muted">I’m interested in applied ML engineering, data science, and software engineering for ML.</dd>
            </div>
          </dl>
        </section>

        <section id="contact" className="scroll-mt-4 py-8 sm:py-10">
          <h2 className="font-display text-4xl tracking-tight">Contact</h2>
          <ul className="mt-3 flex flex-wrap gap-x-6">
            <li><a href="https://github.com/K1taru" className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">GitHub</a></li>
            <li><a href="https://ph.linkedin.com/in/jmgarcia-main" className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">LinkedIn</a></li>
          </ul>
        </section>
      </div>
    </>
  )
}
