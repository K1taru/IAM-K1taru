import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function ProjectMarkdown({ body }: { body: string }) {
  return (
    <div className="case-prose leading-relaxed text-muted wrap-break-word">
      <Markdown remarkPlugins={[remarkGfm]} skipHtml>{body}</Markdown>
    </div>
  )
}
