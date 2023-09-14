/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/home',
            permanent: true,
          },
        ]
      },
      images: {
        domains: [
            "cdn-icons-png.flaticon.com"
        ], paths: {
          "@/assets/*": ["public/assets/*"]
        }
      }
}

module.exports = nextConfig
