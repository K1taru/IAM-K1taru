# Security policy

## Reporting a vulnerability

Email `jmgarcia.main@gmail.com` with the subject `IAM-K1taru security report`.

Include the affected URL or file, reproduction steps, expected impact, and any relevant request/response details. Do not include credentials, personal data, destructive proof-of-concept actions, or data taken from other users.

Please allow a reasonable period for validation and remediation before public disclosure. This project does not offer a bug bounty.

## Supported surface

Only the current production deployment and the latest `main` branch are supported. Linked project deployments are separate applications with their own security boundaries; a link from this portfolio does not place those applications inside this policy.

## Secrets

No production token, private address, or populated `.env` file should be committed. The deployment uses GitHub's short-lived workflow token. If a secret is exposed, revoke and rotate it before removing it from repository history.
