import { DirectionIcon } from '@/components/direction-icon'
import { person } from '@/lib/portfolio'

export function ContactLinks() {
  return (
    <ul className="contact-links">
      <li><a className="text-link" href={person.github}>GitHub <DirectionIcon direction="external" /></a></li>
      <li><a className="text-link" href={person.linkedin}>LinkedIn <DirectionIcon direction="external" /></a></li>
    </ul>
  )
}
