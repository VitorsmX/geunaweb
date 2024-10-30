{/*@import type { NextConfig } from "next/config";*/}

const nextConfig = {
    reactStrictMode: true,
    swcMinify: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                port: "",
                pathname: "/**",
            },
        ],
    },
}

export default nextConfig