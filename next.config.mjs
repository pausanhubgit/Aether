/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mern-omega-three.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mern-bice-phi.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/dvn9252w4/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dvn9252w4/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
