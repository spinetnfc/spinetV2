/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.FILES_API
          ? new URL(process.env.FILES_API).hostname
          : 'files.spinetnfc.com',
        pathname: '/files/**',
      },
    ],
    // Configure image qualities to include quality 100
    qualities: [25, 50, 75, 90, 100],
    // Enable optimization
    unoptimized: false,
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || 'https://api.spinetnfc.com';
    const filesApi = process.env.FILES_API || 'https://files.spinetnfc.com';
    return [
      {
        source: '/api/files/:fileId*',
        destination: `${filesApi}/files/:fileId*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;