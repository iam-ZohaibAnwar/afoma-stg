// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api.afomamarketplace.com",
//         port: "",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;

const enforceWordpress = false;

if (enforceWordpress && !process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `);
}

module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
images: {
    // ✅ Use ONLY remotePatterns (modern & explicit)
    remotePatterns: [
      // Backend API images
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_BASE_HOSTNAME,
        pathname: "/**",
      },

      // WordPress media
      {
        protocol: "https",
        hostname: new URL(process.env.WORDPRESS_API_URL).hostname,
        pathname: "/**",
      },

      // Gravatar (no resizing needed, but allowed)
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
    ],

    // ✅ Cache optimized images aggressively
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days

    // ✅ Only generate modern formats
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      // {
      //   source: "/category",
      //   destination: "/blogs",
      //   permanent: true,
      // },
      {
        source: "/blogs/[slug]",
        destination: "/blogs",
        permanent: true,
      },
    ];
  },
};
