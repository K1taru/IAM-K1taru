import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { about } from '@content/about'
import { credentialGroups } from '@content/certifications'
import { person, profile } from '@content/profile'
import { capabilities } from '@content/skills'
import { ContactLinks } from '@/components/contact-links'
import { DirectionIcon } from '@/components/direction-icon'
import { PageMotion } from '@/components/page-motion'
import { SkillList } from '@/components/skill-list'
import { getCertificateImage } from '@/features/certifications/certificate-image'
import { CertificationCarousel } from '@/features/certifications/certification-carousel'
import { ProjectExplorer } from '@/features/projects/explorer/project-explorer'
import { getProjects } from '@/features/projects/project-content'
import { projectsPath } from '@/features/projects/project-paths'
import './home.css'

export function HomePage() {
  const nameParts = person.name.split(/\s+/)
  const lastName = nameParts.pop()
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
            {nameParts.map((part, index) => <Fragment key={index}><span>{part}</span>{' '}</Fragment>)}
            <span className="home-name-accent">{lastName}.</span>
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
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
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
            {about.homeOverview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
          <h2 className="section-title" id="home-projects-title"><Link href={projectsPath} id="project-map">Projects</Link></h2>
          <ProjectExplorer projects={projects.map(({ slug, title, year, summary, role, preview, model }) => ({
            slug, title, year, summary, role, preview, model,
          }))} />
          <Link className="text-link" href={projectsPath}>Browse all projects <DirectionIcon /></Link>
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
