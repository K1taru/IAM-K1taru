import assert from 'node:assert/strict'
import test from 'node:test'
import { verifiedSha } from './poll-deploy-pi.mjs'

const sha = 'a'.repeat(40)
const run = { status: 'completed', conclusion: 'success', event: 'push', head_branch: 'main', head_sha: sha }

test('only the newest successful main push is deployable', () => {
  assert.equal(verifiedSha([run]), sha)
  assert.equal(verifiedSha([{ ...run, status: 'in_progress', conclusion: null }, run]), null)
  assert.equal(verifiedSha([{ ...run, conclusion: 'failure' }, run]), null)
  assert.equal(verifiedSha([]), null)
  assert.throws(() => verifiedSha([{ ...run, head_branch: 'development' }]))
  assert.throws(() => verifiedSha([{ ...run, head_sha: 'not-a-sha' }]))
})
