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

let wordpressHostname = null;
try {
  wordpressHostname = process.env.WORDPRESS_API_URL
    ? new URL(process.env.WORDPRESS_API_URL).hostname
    : null;
} catch (e) {
  wordpressHostname = null;
}

module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Re-enable Next.js image optimization (big LCP win).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.afomamarketplace.com",
        pathname: "/**",
      },
      // Allow WP-hosted images when WP is configured.
      ...(wordpressHostname
        ? [
            {
              protocol: "https",
              hostname: wordpressHostname,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "afomamarketplace.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.afomamarketplace.com",
        pathname: "/**",
      },
    ],
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
