/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ptc/ui', '@ptc/core', '@ptc/auth', '@ptc/config'],
  poweredByHeader: false,
};

export default nextConfig;
