import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Firebase Storage
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      // ImgBB
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" },
      // PostImages
      { protocol: "https", hostname: "i.postimg.cc" },
      // Imgur
      { protocol: "https", hostname: "i.imgur.com" },
      // Google Drive (direct links)
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Cloudinary
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Generic — allow any https image
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
