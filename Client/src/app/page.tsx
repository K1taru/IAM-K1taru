import Image from 'next/image'
import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'
import { ContactLinks } from '@/components/contact-links'
import { PageMotion } from '@/components/page-motion'
import { capabilities, person } from '@/lib/portfolio'
import { getProjects } from '@/lib/projects'
import { pageMetadata } from '@/lib/site'
import { credentialGroups } from './certifications/credentials'
import './home.css'

export const metadata = pageMetadata('/')

const projectPreviews = [
  {
    slug: 'mdsystem',
    description: 'I led frontend development for a campus clinic system that lets students submit medical forms and staff review them online.',
  },
  {
    slug: 'moskita',
    description: 'I trained a computer vision model to flag containers that could become mosquito breeding sites in photos and live camera feeds.',
  },
  {
    slug: 'pi-monitor',
    description: 'My Raspberry Pi runs several of my services. I built a dashboard so I can check on it when I’m away from home.',
  },
]

const credentialPreviews = [
  'ccna-switching-routing-wireless',
  'ef-set',
]

export default function HomePage() {
  const projects = getProjects()
  const credentials = credentialGroups.flatMap((group) => group.credentials)
  const networking = credentials.find(({ slug }) => slug === credentialPreviews[0])
  const english = credentials.find(({ slug }) => slug === credentialPreviews[1])

  return (
    <PageMotion>
      <section id="home" data-nav-section="home" className="home-hero" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="home-role">Computer engineering student</p>
          <h1 id="home-title" className="home-title font-display"><span>John Michael</span>{' '}<span>Garcia</span></h1>
          <p className="page-lede">{person.positioning}</p>
          <div className="home-actions">
            <Link href="#about" className="button button-primary">
              Explore portfolio <DirectionIcon direction="down" />
            </Link>
            <Link href="#contact" className="button">Contact</Link>
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
        </figure>
      </section>

      <div className="home-folders folder-grid">
        <section id="about" data-nav-section="about" className="folder-preview overview-split" aria-labelledby="home-about-title" data-reveal="0">
          <h2 className="folder-title font-display" id="home-about-title"><Link href="/about/">About</Link></h2>
          <div className="overview-copy">
            <p>I study computer engineering at T.I.P. Manila, where I specialize in data science. I’m especially interested in what a small device can do with a camera and a trained model.</p>
            <p>Outside the lab, I served as our department’s student council treasurer. At the Grundfos Data &amp; AI Inclusion Hackathon, I worked on the interface and document search for our team’s assistant, MARIO.</p>
            <Link className="text-link" href="/about/">More about me <DirectionIcon /></Link>
          </div>
        </section>

        <section id="skills" data-nav-section="skills" className="home-editorial" aria-labelledby="home-skills-title" data-reveal="0">
          <h2 className="section-title" id="home-skills-title"><Link href="/about/#tools">Skills</Link></h2>
          <ul className="skill-previews">
            {capabilities.map(({ label, description, skills }) => (
              <li key={label}>
                <h3>{label}</h3>
                <p>{description}</p>
                <small>{skills.slice(0, 3).join(' · ')}</small>
              </li>
            ))}
          </ul>
          <Link className="text-link folder-action" href="/about/#tools">See all skills and tools <DirectionIcon /></Link>
        </section>

        <section id="projects" data-nav-section="projects" className="folder-preview folder-projects" aria-labelledby="home-projects-title" data-reveal="0">
          <h2 className="folder-title font-display" id="home-projects-title"><Link href="/projects/" id="project-map">Projects</Link></h2>
          <ul className="folder-project-list">
            {projectPreviews.map(({ slug, description }) => {
              const project = projects.find((entry) => entry.slug === slug)
              if (!project) return null

              return (
                <li className="folder-project" key={slug}>
                  <h3>
                    <Link href={`/projects/${slug}/`} className="folder-project-link font-display">
                      {project.title} <DirectionIcon />
                    </Link>
                  </h3>
                  <p>{description}</p>
                </li>
              )
            })}
          </ul>
          <Link className="text-link folder-action" href="/projects/">Browse all projects <DirectionIcon /></Link>
        </section>

        <section id="certifications" data-nav-section="certifications" className="folder-preview overview-split" aria-labelledby="home-certifications-title" data-reveal="0">
          <div>
            <h2 className="folder-title font-display" id="home-certifications-title"><Link href="/certifications/">Certifications</Link></h2>
            <p className="overview-note">My collection includes networking coursework, language proficiency, and recognition for academics and student leadership.</p>
          </div>
          <div className="overview-copy">
            <div className="folder-credentials">
              {networking && (
                <div className="folder-certificate">
                  <Image src={`/media/certifications/${networking.slug}.webp`} alt="" fill unoptimized />
                </div>
              )}
              <ul className="folder-credentials-list">
                {networking && (
                  <li>
                    <span>{networking.title}</span>
                    <small>{networking.issuer}</small>
                  </li>
                )}
                {english && <li>{english.title}</li>}
              </ul>
            </div>
            <Link className="text-link folder-action" href="/certifications/">View certifications <DirectionIcon /></Link>
          </div>
        </section>

        <section id="contact" data-nav-section="contact" className="home-editorial overview-split home-contact" aria-labelledby="home-contact-title" data-reveal="0">
          <h2 className="section-title" id="home-contact-title">Contact</h2>
          <div className="overview-copy">
            <p>If you’d like to talk about a project or a role in software engineering, applied machine learning, or data science, you can reach me on LinkedIn. My code is on GitHub.</p>
            <ContactLinks />
          </div>
        </section>
      </div>
    </PageMotion>
  )
}
