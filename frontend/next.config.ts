import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  domains: [
    'airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com',
    'my-airdrop-uploads.s3.ap-south-1.amazonaws.com',
    'example.com' // ⛔ use only for dev/test
  ],
},

};

export default nextConfig;
