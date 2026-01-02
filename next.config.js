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
   unoptimized: true,
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
