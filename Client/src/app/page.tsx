import Image from 'next/image'
import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'
import { person } from '@/lib/portfolio'
import { pageMetadata } from '@/lib/site'
import './home.css'

export const metadata = pageMetadata('/')

const folders = [
  { label: 'Projects', href: '/projects/' },
  { label: 'Certifications', href: '/certifications/' },
  { label: 'About', href: '/about/' },
]

export default function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="home-role">Computer engineering student</p>
          <h1 id="home-title" className="home-title font-display"><span>John Michael</span>{' '}<span>Garcia</span></h1>
          <p className="page-lede">{person.positioning}</p>
          <div className="home-actions">
            <Link href="#project-map" className="button button-primary">
              Explore portfolio <DirectionIcon direction="down" />
            </Link>
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

      <nav className="home-folders" id="project-map" aria-label="Explore the portfolio">
        <ul className="folder-grid">
          {folders.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className="folder-link">
                <span className="font-display">{label}</span>
                <DirectionIcon />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="home-about" aria-labelledby="about-next-title">
        <div>
          <h2 id="about-next-title" className="section-title">A bit about me</h2>
          <p className="mt-3 max-w-[58ch] leading-relaxed text-muted">
            I’m studying computer engineering in Manila with a specialization in data science. My projects include clinic records, gym management, and computer vision on small devices.
          </p>
        </div>
        <Link href="/about/" className="text-link">About me <DirectionIcon /></Link>
      </section>
    </>
  )
}
