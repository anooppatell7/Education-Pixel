
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
    domains: [
        "i.ytimg.com",
        "placehold.co",
        "picsum.photos",
        "images.jdmagicbox.com",
        "jsdl.in",
        "res.cloudinary.com"
    ]
  },
};

export default nextConfig;
