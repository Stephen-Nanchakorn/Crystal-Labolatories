import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // สำหรับรูปปลั๊กอินจาก Unsplash
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // สำหรับรูปจาก Supabase Storage
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development', // เพิ่ม performance ใน development
  },
  // ... other config
};

export default nextConfig;

// ถ้าต้องการ force dynamic rendering สำหรับบางหน้า
module.exports = {
  experimental: {
    dynamicIO: true,
  },
};