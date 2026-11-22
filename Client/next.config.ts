import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: {
    useTypeScriptCli: false,
  },
}

export default config
