const paths = {
  right: 'M4 10h11m-4-4 4 4-4 4',
  left: 'M16 10H5m4-4-4 4 4 4',
  down: 'M10 4v11m-4-4 4 4 4-4',
  external: 'M5 15 15 5M7 5h8v8',
}

export function DirectionIcon({ direction = 'right' }: { direction?: keyof typeof paths }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="direction-icon">
      <path d={paths[direction]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
