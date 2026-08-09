import { getCollection } from 'astro:content';
import { site, skillGroups } from '@/data/site';

export const prerender = true;

export async function GET() {
  const projects = (await getCollection('projects'))
    .filter((project) => !project.data.draft)
    .map(({ data }) => ({
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      year: data.year,
      role: data.role,
      team: data.team,
      contributions: data.contributions,
      skills: data.skills,
      repository: data.repository,
      demo: data.demo,
      caseStudy: new URL(`/projects/${data.slug}/`, site.url).toString(),
      evidence: data.evidence,
      metrics: data.metrics
    }));

  return new Response(JSON.stringify({
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    person: {
      name: site.name,
      handle: site.handle,
      location: site.location,
      education: `${site.degree}, ${site.school}`,
      positioning: site.positioning,
      targetRoles: site.roleTargets,
      email: site.email,
      github: site.github,
      linkedin: site.linkedin
    },
    capabilities: skillGroups,
    projects
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

