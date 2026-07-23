/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    ],
  },
};

export default nextConfig;
