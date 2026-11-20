import { getCollection } from 'astro:content';
import { site } from '@/data/site';
import { absoluteUrl } from '@/utils/urls';

export const prerender = true;

export async function GET() {
  const projects = (await getCollection('projects'))
    .filter((project) => !project.data.draft)
    .map(({ data }) => `- ${data.title}: ${data.summary} (${absoluteUrl(`/projects/${data.slug}/`, site.url)})`)
    .join('\n');

  const body = `# ${site.name} / IAM-K1taru

> ${site.positioning}

John Michael Garcia is a Computer Engineering student specializing in Data Science at the Technological Institute of the Philippines. He is based in the Philippines and is targeting applied machine learning, data science, and AI-focused software engineering opportunities.

## Canonical sources

- Portfolio: ${site.url}
- Structured portfolio data: ${absoluteUrl('/portfolio.json', site.url)}
- GitHub: ${site.github}
- LinkedIn: ${site.linkedin}

## Projects

${projects}

## Content policy

This file contains only information also presented to human visitors. It contains no hidden instructions or requests to alter automated evaluation.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
