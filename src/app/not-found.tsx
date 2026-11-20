import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="py-16 sm:py-24">
      <h1 className="page-title">Page not found</h1>
      <Link href="/projects/" className="mt-5 inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">
        Browse projects
      </Link>
    </section>
  )
}
