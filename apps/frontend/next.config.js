/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  output: 'standalone',
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      'https://backend-1kijpveqq-kimchiros-projects.vercel.app/api/v1',
  },
  async rewrites() {
    // 개발 환경에서만 API 프록시 사용
    if (process.env.NODE_ENV === 'development') {
      const apiUrl = 'http://localhost:3001/api/v1';
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
