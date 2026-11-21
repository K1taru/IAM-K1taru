import { DirectionIcon } from '@/components/direction-icon'
import { person } from '@content/profile'

export function ContactLinks({ includeEmail = false }: { includeEmail?: boolean }) {
  return (
    <ul className="contact-links">
      <li><a className="text-link" href={person.github}>GitHub <DirectionIcon direction="external" /></a></li>
      <li><a className="text-link" href={person.linkedin}>LinkedIn <DirectionIcon direction="external" /></a></li>
      {includeEmail && <li><a className="text-link" href={`mailto:${person.email}`}>Email <DirectionIcon direction="external" /></a></li>}
    </ul>
  )
}
