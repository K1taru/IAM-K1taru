import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    deviceSizes: [320, 640, 960, 1440, 1920],
    imageSizes: [160],
  },
  experimental: {
    useTypeScriptCli: false,
  },
}

export default config
