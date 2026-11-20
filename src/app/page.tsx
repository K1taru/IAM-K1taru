import Image from 'next/image'
import Link from 'next/link'
import { ProjectMap } from '@/components/project-map'
import { getProjects } from '@/lib/projects'
import { canonical } from '@/lib/site'
import './home.css'

export const metadata = { alternates: canonical('/') }

const capabilities = [
  {
    title: 'Applied machine learning',
    description: 'Prepare datasets, evaluate computer vision models, and run inference close to the camera.',
    tools: 'Python, PyTorch, YOLO, ONNX',
  },
  {
    title: 'Product engineering',
    description: 'Build web and mobile interfaces and the services that support their day-to-day workflows.',
    tools: 'TypeScript, React, Django, Node.js',
  },
  {
    title: 'Data and infrastructure',
    description: 'Deploy, monitor, and maintain self-hosted services on resource-constrained hardware.',
    tools: 'Linux, Raspberry Pi, Docker, PostgreSQL',
  },
]

export default function HomePage() {
  const projects = getProjects()

  return (
    <div className="pb-12 sm:pb-20">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-grid">
          <div>
            <p className="home-intro-line">Applied ML · Full-stack systems · Edge deployment</p>
            <h1 id="home-title" className="home-title font-display">
              <span>John Michael</span>{' '}
              <span>Garcia</span>
            </h1>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted sm:mt-7 sm:text-lg">
              I build and self-host software and machine learning systems, from edge computer vision to the tools I use to operate them.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <Link href="/projects/" className="action-press inline-flex min-h-11 items-center rounded-md bg-accent px-5 py-2 text-sm font-semibold text-on-accent hover:underline hover:underline-offset-4">
                Explore projects
              </Link>
              <Link href="/about/#contact" className="inline-flex min-h-11 items-center rounded-md border border-control px-5 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent">
                Contact
              </Link>
            </div>
          </div>

          <div className="home-portrait">
            <div className="home-portrait-stage">
              <div className="home-portrait-beam" aria-hidden="true" />
              <div className="home-portrait-orbit home-portrait-orbit-outer" aria-hidden="true"><span /></div>
              <div className="home-portrait-orbit home-portrait-orbit-inner" aria-hidden="true"><span /></div>
              <figure className="home-portrait-frame">
                <Image
                  src="/media/profile.webp"
                  alt="John Michael Garcia wearing formal business attire"
                  width={480}
                  height={480}
                  unoptimized
                  preload
                  className="block h-auto w-full rounded-t-sm"
                />
                <figcaption className="border-t border-divider bg-surface px-3 py-2 text-center text-xs leading-snug text-ink sm:text-sm">
                  Computer Engineering · Data Science
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
        <div className="home-facts">
          <span>Based in the Philippines</span>
          {projects.length > 0 && (
            <a href="#project-map" className="text-accent underline decoration-accent/60 underline-offset-4 hover:decoration-accent">
              {projects.length} {projects.length === 1 ? 'case study' : 'case studies'}
            </a>
          )}
          <Link href="/about/#experience" className="text-ink underline decoration-muted underline-offset-4 hover:text-accent">
            Education and experience
          </Link>
        </div>
      </section>

      {projects.length > 0 && (
        <section id="project-map" className="scroll-mt-6 border-b border-divider py-11 sm:py-16" aria-labelledby="project-map-title">
          <h2 id="project-map-title" className="font-display text-5xl tracking-tight sm:text-6xl">Project map</h2>
          <p className="mt-3 mb-6 max-w-[65ch] leading-relaxed text-muted">
            Explore the work by domain and open a case study for my role, contributions, and results.
          </p>
          <ProjectMap projects={projects.map(({ slug, title, year }) => ({ slug, title, year }))} />
        </section>
      )}

      <section className="border-b border-divider py-11 sm:py-16" aria-labelledby="capabilities-title">
        <h2 id="capabilities-title" className="mb-6 font-display text-5xl tracking-tight sm:text-6xl">What I work with</h2>
        <div className="grid gap-6 sm:grid-cols-3 lg:gap-10">
          {capabilities.map(({ title, description, tools }) => (
            <article key={title} className="border-t-2 border-accent pt-4">
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{description}</p>
              <p className="mt-3 text-sm font-medium text-accent">{tools}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-10 sm:pt-14" aria-labelledby="about-next-title">
        <div>
          <h2 id="about-next-title" className="font-display text-4xl tracking-tight sm:text-5xl">Background and next steps</h2>
          <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">
            My education, project milestones, and the areas I want to develop next.
          </p>
        </div>
        <Link href="/about/" className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">
          About me
        </Link>
      </section>
    </div>
  )
}
