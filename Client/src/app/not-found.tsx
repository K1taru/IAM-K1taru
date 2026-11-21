import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'

export default function NotFound() {
  return (
    <section className="page-intro">
      <div className="panel-frame panel-pad max-w-3xl">
        <h1 className="page-title">Page not found</h1>
        <p className="page-lede">If you were looking for a project, you can find it in the project list.</p>
        <Link href="/projects/" className="button button-primary mt-6">Browse projects <DirectionIcon /></Link>
      </div>
    </section>
  )
}
