import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    "https://3000-firebase-studio-1747509909089.cluster-3gc7bglotjgwuxlqpiut7yyqt4.cloudworkstations.dev"
  ],
};

export default nextConfig;
