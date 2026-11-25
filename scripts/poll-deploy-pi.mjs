import { execFileSync } from 'node:child_process'
import { readlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export function verifiedSha(runs) {
  const run = runs?.[0]
  if (!run || run.status !== 'completed' || run.conclusion !== 'success') return null
  if (run.event !== 'push' || run.head_branch !== 'main' || !/^[0-9a-f]{40}$/.test(run.head_sha)) {
    throw new Error('GitHub returned an unexpected workflow run.')
  }
  return run.head_sha
}

async function poll() {
  const root = '/home/k1taru/srv/IAM-K1taru'
  const token = process.env.GITHUB_READ_TOKEN
  if (!token) throw new Error('Set the Pi GitHub read token (Actions: read).')

  const url = 'https://api.github.com/repos/K1taru/IAM-K1taru/actions/workflows/ci.yml/runs?branch=main&event=push&per_page=1'
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'iam-k1taru-pi-deploy',
    },
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) throw new Error(`GitHub workflow lookup failed: HTTP ${response.status}`)

  const { workflow_runs: runs } = await response.json()
  const sha = verifiedSha(runs)
  if (!sha) {
    console.log('Latest main push has no successful completed CI run; deployment skipped.')
    return
  }

  execFileSync('git', ['-C', root, 'fetch', '--no-tags', 'origin', 'main'], { stdio: 'inherit' })
  const latestSha = execFileSync('git', ['-C', root, 'rev-parse', 'refs/remotes/origin/main'], { encoding: 'utf8' }).trim()
  if (sha !== latestSha) {
    console.log('Latest main commit has not passed CI; deployment skipped.')
    return
  }
  const deployedSha = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  let activeRelease = ''
  try {
    activeRelease = readlinkSync(`${root}/Client/out`)
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'EINVAL') throw error
  }
  if (sha === deployedSha && activeRelease === `/home/k1taru/srv/iam-k1taru-releases/${sha}/out`) {
    console.log('Latest verified commit is already deployed.')
    return
  }

  execFileSync('bash', [`${root}/scripts/deploy-pi.sh`, sha], { stdio: 'inherit' })
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await poll()
