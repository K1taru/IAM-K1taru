export function ArchitectureFlow({ stages, label, compact = false }: {
  stages: string[]; label: string; compact?: boolean
}) {
  return (
    <figure className={`monitor-grid rounded-xl border border-divider bg-canvas p-4 text-ink ${compact ? '' : 'sm:p-6'}`}>
      <figcaption className="mb-4 text-sm font-medium text-muted">
        {label}
      </figcaption>
      <ol className={`grid gap-4 ${compact ? 'sm:grid-cols-3 sm:gap-3' : ''}`}>
        {stages.map((stage, index) => (
          <li key={stage} className="architecture-step relative">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`absolute -top-4 left-6 h-4 border-l border-accent ${compact ? 'sm:top-1/2 sm:-left-3 sm:h-0 sm:w-3 sm:border-t sm:border-l-0' : ''}`}
              />
            )}
            <div className={`relative flex h-full min-h-12 items-center gap-3 rounded-md border border-control bg-surface py-2 font-mono text-sm ${compact ? 'px-2 sm:justify-center sm:text-center' : 'px-4'}`}>
              {!compact && <span aria-hidden="true" className="size-2 shrink-0 rounded-sm border border-accent" />}
              {stage}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}
