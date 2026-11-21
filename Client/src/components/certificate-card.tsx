'use client'

import Image from 'next/image'
import { useRef, type MouseEvent } from 'react'
import { DirectionIcon } from './direction-icon'

type CertificateCardProps = {
  file?: string
  slug: string
  title: string
  issuer: string
  date: string
  compact?: boolean
}

export function CertificateCard({ file, slug, title, issuer, date, compact = false }: CertificateCardProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLAnchorElement>(null)

  function open(event: MouseEvent<HTMLAnchorElement>) {
    const viewer = dialog.current
    if (!viewer || typeof viewer.showModal !== 'function' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    trigger.current = event.currentTarget
    viewer.showModal()
  }

  function close() {
    dialog.current?.close()
  }

  function finishClosing() {
    trigger.current?.focus()
  }

  return (
    <article className={`panel-frame certificate-card${compact ? ' certificate-card-compact' : ''}`}>
      {file ? (
        <a href={file} className="certificate-thumbnail" onClick={open} aria-haspopup="dialog" aria-label={`Enlarge certificate for ${title}`}>
          <Image src={file} alt="" fill unoptimized loading="lazy" />
        </a>
      ) : (
        <div className="certificate-emblem" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3.5h14v12H5zM8 7h8M8 10h4m1 5.5v5l2.5-1.5 2.5 1.5v-5" />
          </svg>
        </div>
      )}
      <header className="certificate-card-heading">
        <p className="panel-label" title={compact ? issuer : undefined}>{issuer}</p>
        <h3 title={compact ? title : undefined}>{title}</h3>
      </header>
      <dl className="certificate-details">
        <div><dt>Issued</dt><dd>{date}</dd></div>
      </dl>
      {file && <footer className="panel-actions">
        <a href={file} className="text-link" onClick={open} aria-haspopup="dialog">
          View certificate<span className="sr-only"> for {title}</span> <DirectionIcon />
        </a>
      </footer>}

      {file && <dialog
        ref={dialog}
        className="certificate-dialog"
        aria-labelledby={`${slug}-dialog-title`}
        onClose={finishClosing}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
      >
        <div className="certificate-dialog-panel">
          <header className="certificate-dialog-header">
            <div>
              <h2 id={`${slug}-dialog-title`}>{title}</h2>
              <p>{issuer} · {date}</p>
            </div>
            <button type="button" className="certificate-close" onClick={close} autoFocus aria-label={`Close ${title} certificate`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>
          <div className="certificate-dialog-image">
            <Image src={file} alt={`${title} certificate issued by ${issuer}`} fill unoptimized className="object-contain" />
          </div>
          <footer className="certificate-dialog-footer">
            <p>Press Esc or click outside the certificate to close.</p>
            <a href={file} target="_blank" rel="noreferrer" className="text-link">
              Open full size <DirectionIcon direction="external" />
            </a>
          </footer>
        </div>
      </dialog>}
    </article>
  )
}
