/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["clips-media-assets2.twitch.tv", "static-cdn.jtvnw.net"],
  },
  experimental: { images: { allowFutureImage: true } }
};

module.exports = nextConfig;
