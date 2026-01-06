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
  // Increase build timeout
  staticPageGenerationTimeout: 300,
  // Optimize webpack for faster builds
  webpack: (config, { isServer, dev }) => {
    // Only apply aggressive splitting in production builds
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendors: false,
          // Vendor chunk for large libraries
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            minChunks: 1,
            maxSize: 244000, // 244kb
          },
          // FontAwesome chunk
          fontawesome: {
            name: 'fontawesome',
            test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          // React/Next chunks
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
        },
      };
      
      // Optimize build performance (production only)
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
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
  // Experimental features for faster builds (only in production)
  ...(process.env.NODE_ENV === "production" ? {
    experimental: {
      optimizeCss: true,
    },
    compiler: {
      removeConsole: true,
    },
  } : {}),
};
