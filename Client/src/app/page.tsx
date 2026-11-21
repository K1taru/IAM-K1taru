import { CertificationCarousel } from '@/components/certification-carousel'
import { ProjectExplorer } from '@/components/project-explorer'
import { SkillList } from '@/components/skill-list'
import Image from 'next/image'
import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'
import { ContactLinks } from '@/components/contact-links'
import { PageMotion } from '@/components/page-motion'
import { capabilities, person } from '@/lib/portfolio'
import { getProjects } from '@/lib/projects'
import { pageMetadata } from '@/lib/site'
import { credentialGroups, getCertificateImage } from './certifications/credentials'
import './home.css'

export const metadata = pageMetadata('/')

export default function HomePage() {
  const projects = getProjects()
  const credentials = credentialGroups.flatMap((group) => group.credentials).map((credential) => ({
    ...credential,
    file: getCertificateImage(credential.slug),
  }))

  return (
    <PageMotion>
      <section id="home" className="home-hero" aria-labelledby="home-title">
        <div className="home-intro">
          <h1 id="home-title" className="home-title font-display">
            <span className="home-greeting">Hello, I’m</span>{' '}
            <span>John</span>{' '}
            <span>Michael</span>{' '}
            <span className="home-name-accent">Garcia.</span>
          </h1>
          <p className="page-lede">{person.positioning}</p>
          <div className="home-actions">
            <Link href="#projects" className="button button-primary">
              View my work <DirectionIcon direction="down" />
            </Link>
            <Link href="#contact" className="button">Contact me</Link>
          </div>
        </div>

        <figure className="home-portrait">
          <div className="portrait-grid monitor-grid" aria-hidden="true" />
          <div className="portrait-reticle" aria-hidden="true"><span /></div>
          <div className="portrait-orbit portrait-orbit-outer" aria-hidden="true" />
          <div className="portrait-orbit portrait-orbit-inner" aria-hidden="true" />
          <div className="portrait-signal" aria-hidden="true" />
          <div className="portrait-board">
            <div className="portrait-window">
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
          </div>
        </figure>
      </section>

      <div className="overview-sections">
        <section id="about" className="home-section overview-split" aria-labelledby="home-about-title" data-reveal="0">
          <h2 className="section-title" id="home-about-title"><Link href="/about/">About</Link></h2>
          <div className="overview-copy panel-frame panel-pad">
            <p>I study computer engineering at T.I.P. Manila, where I specialize in data science. I’m especially interested in what a small device can do with a camera and a trained model.</p>
            <p>Outside the lab, I served as our department’s student council treasurer. At the Grundfos Data &amp; AI Inclusion Hackathon, I worked on the interface and document search for our team’s assistant, MARIO.</p>
            <Link className="text-link" href="/about/">More about me <DirectionIcon /></Link>
          </div>
        </section>

        <section id="skills" className="home-section" aria-labelledby="home-skills-title">
          <h2 className="section-title" id="home-skills-title" data-reveal="0"><Link href="/about/#tools">Skills</Link></h2>
          <ul className="skill-previews">
            {capabilities.map(({ label, description, skills }, index) => (
              <li key={label} className="panel-frame panel-pad" data-reveal={index + 1}>
                <h3>{label}</h3>
                <p>{description}</p>
                <SkillList skills={skills.slice(0, 3)} label={label} />
              </li>
            ))}
          </ul>
          <Link className="text-link" href="/about/#tools">See all skills and tools <DirectionIcon /></Link>
        </section>

        <section id="projects" className="home-section" aria-labelledby="home-projects-title" data-reveal="0">
          <h2 className="section-title" id="home-projects-title"><Link href="/projects/" id="project-map">Projects</Link></h2>
          <ProjectExplorer projects={projects.map(({ slug, title, year, summary, role, preview, model }) => ({
            slug, title, year, summary, role, preview, model,
          }))} />
          <Link className="text-link" href="/projects/">Browse all projects <DirectionIcon /></Link>
        </section>

        <section id="certifications" className="home-section" aria-labelledby="home-certifications-title">
          <div data-reveal="0">
            <h2 className="section-title" id="home-certifications-title"><Link href="/certifications/">Certifications</Link></h2>
            <p className="overview-note">My collection includes networking coursework, language proficiency, and recognition for academics and student leadership.</p>
          </div>
          <CertificationCarousel credentials={credentials} />
          <Link className="text-link" href="/certifications/">View all certifications <DirectionIcon /></Link>
        </section>

        <section id="contact" className="home-section overview-split home-contact" aria-labelledby="home-contact-title" data-reveal="0">
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
