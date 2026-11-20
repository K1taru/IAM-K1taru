import Image from 'next/image'
import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'
import { person } from '@/lib/portfolio'
import { getProjects } from '@/lib/projects'
import { pageMetadata } from '@/lib/site'
import './home.css'

export const metadata = pageMetadata('/')

const supportingProjects = [
  { slug: 'mdsystem', domain: 'Team software' },
  { slug: 'moskita', domain: 'Computer vision' },
  { slug: 'pi-monitor', domain: 'Infrastructure' },
]

function WorkPreview({ slug }: { slug: string }) {
  if (slug === 'pi-monitor') {
    return (
      <Image
        className="work-preview work-hardware"
        src="/media/projects/pi-monitor/hardware-illustration.webp"
        width={1100}
        height={733}
        alt="Illustration of a Raspberry Pi board with a black heat sink"
        unoptimized
      />
    )
  }

  if (slug === 'moskita') {
    return (
      <figure className="work-preview vision-preview monitor-grid">
        <svg aria-hidden="true" viewBox="0 0 180 95" className="vision-frame" fill="none">
          <path d="M57 19H34v18m89-18h23v18M34 59v18h23m89-18v18h-23" />
          <path d="M64 37h52l-7 29H71zM60 37h60m-42-5v-7h24v7" />
          <path d="M90 12v13m0 42v16M24 48h44m45 0h44" className="vision-guide" />
        </svg>
        <figcaption>YOLO training <DirectionIcon /> ONNX export <DirectionIcon /> Camera inference</figcaption>
      </figure>
    )
  }

  return (
    <figure className="work-preview portal-preview monitor-grid">
      <div className="portal-stack" aria-hidden="true">
        <span className="portal-window portal-first" />
        <span className="portal-window portal-second" />
        <span className="portal-window portal-phone" />
      </div>
      <figcaption>Staff portal, patient portal, mobile app</figcaption>
    </figure>
  )
}

export default function HomePage() {
  const projects = getProjects()
  const feature = projects.find(({ slug }) => slug === 'gymms')
  const supporting = supportingProjects.flatMap(({ slug, domain }) => {
    const project = projects.find((entry) => entry.slug === slug)
    return project ? [{ ...project, domain }] : []
  })
  const hasSelectedWork = Boolean(feature || supporting.length)

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="home-role">Software developer</p>
          <h1 id="home-title" className="home-title font-display"><span>John Michael</span>{' '}<span>Garcia</span></h1>
          <p className="page-lede">{person.positioning}</p>
          <div className="home-actions">
            {projects.length > 0 && (
              <Link href={hasSelectedWork ? '#project-map' : '/projects/'} className="button button-primary">
                {hasSelectedWork ? 'View selected work' : 'View projects'} <DirectionIcon direction={hasSelectedWork ? 'down' : 'right'} />
              </Link>
            )}
            <Link href="/about/#contact" className="button">Contact</Link>
          </div>
        </div>

        <figure className="home-portrait">
          <div className="portrait-board monitor-grid">
            <Image
              src="/media/profile.webp"
              alt="John Michael Garcia in formal business attire"
              width={480}
              height={480}
              unoptimized
              preload
              className="portrait-image"
            />
          </div>
          <figcaption><span aria-hidden="true" /> Based in the {person.location}</figcaption>
        </figure>
      </section>

      {hasSelectedWork && (
        <section className="home-work" id="project-map" aria-labelledby="selected-work-title">
          <div className="home-section-heading">
            <h2 id="selected-work-title" className="section-title">Selected work</h2>
            <Link href="/projects/" className="text-link">All projects <DirectionIcon /></Link>
          </div>
          {feature && (
            <article className="featured-work">
              <div className="featured-copy">
                <p className="work-domain">Full-stack application</p>
                <h3 className="featured-title font-display">{feature.title}</h3>
                <p className="max-w-[45ch] leading-relaxed text-muted">{feature.summary}</p>
                <Link href={`/projects/${feature.slug}/`} className="text-link" aria-label={`Read the ${feature.title} case study`}>
                  Read case study <DirectionIcon />
                </Link>
              </div>
              <figure className="featured-workflow monitor-grid" aria-labelledby="workflow-caption">
                <figcaption id="workflow-caption">Inside GyMMS</figcaption>
                <ul>
                  <li>Memberships</li>
                  <li>Payments</li>
                  <li>Check-ins</li>
                </ul>
                <div className="workflow-app">
                  <span>Gym management app</span>
                  <span>Django on Raspberry Pi</span>
                </div>
              </figure>
            </article>
          )}
          {supporting.length > 0 && (
            <div className="work-grid">
              {supporting.map(({ slug, title, summary, domain }) => (
                <article key={slug} className="work-card">
                  <WorkPreview slug={slug} />
                  <div className="work-card-copy">
                    <p className="work-domain">{domain}</p>
                    <h3 className="work-card-title font-display">
                      <Link href={`/projects/${slug}/`} className="work-title-link">
                        {title} <DirectionIcon />
                      </Link>
                    </h3>
                    <p className="leading-relaxed text-muted">{summary}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="home-about" aria-labelledby="about-next-title">
        <div>
          <h2 id="about-next-title" className="section-title">A bit about me</h2>
          <p className="mt-3 max-w-[58ch] leading-relaxed text-muted">
            I studied computer engineering and data science. The projects here grew out of learning to build software and run it myself.
          </p>
        </div>
        <Link href="/about/" className="text-link">About me <DirectionIcon /></Link>
      </section>
    </>
  )
}
