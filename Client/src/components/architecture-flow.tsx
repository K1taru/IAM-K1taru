export function ArchitectureFlow({ stages, label }: { stages: string[]; label: string }) {
  return (
    <figure className="workflow-figure panel-frame monitor-grid">
      <figcaption>{label}</figcaption>
      <ol className="workflow-stages">
        {stages.map((stage) => (
          <li key={stage}><span aria-hidden="true" className="workflow-marker" />{stage}</li>
        ))}
      </ol>
    </figure>
  )
}
