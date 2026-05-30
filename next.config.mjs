/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack on Windows due to known stability issues
  // Use webpack instead for development
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
