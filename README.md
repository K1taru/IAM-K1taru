# John Michael Garcia Portfolio

A static Next.js portfolio for Raspberry Pi and Vercel. The application lives in `Client/`.

Run these commands from the repository root to develop locally.

```sh
cd Client
nvm use
npm ci
npm run dev
```

From `Client/`, run `npm run lint`, `npm run typecheck`, and `npm run build` before merging.
The production build is exported to `Client/out/`. Run `node --test` from the repository root to check both the client and the optional demo-status service.

[Portfolio architecture](docs/architecture.md) · [Deployment](docs/deployment.md)
