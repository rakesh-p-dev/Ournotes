/** @type {import('next').NextConfig} */
const nextConfig = { images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
       
      },
    ],
  },
experimental: {
    serverComponentsExternalPackages: ["pdf-parse","@langchain/core/tools"],
  },};

export default nextConfig;
