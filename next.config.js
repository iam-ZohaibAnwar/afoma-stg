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
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Optimize webpack for faster builds and runtime
  webpack: (config, { isServer, dev }) => {
    // Apply optimizations in both dev and production for better performance
    if (!isServer) {
      // Better chunk splitting for faster loading
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 244000,
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
          // FontAwesome chunk - separate for better caching
          fontawesome: {
            name: 'fontawesome',
            test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          // React/Next chunks - critical for performance
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          // Form libraries chunk
          forms: {
            name: 'forms',
            test: /[\\/]node_modules[\\/](formik|yup|react-select)[\\/]/,
            chunks: 'all',
            priority: 25,
            enforce: true,
          },
        },
      };
      
      // Tree shaking optimizations (production only to avoid breaking dev)
      if (!dev) {
        config.optimization.usedExports = true;
        // Use 'flag' mode - only respect package.json sideEffects field
        // This is safer than true/false and won't break CSS/FontAwesome
        config.optimization.sideEffects = 'flag';
      }
    }
    
    return config;
  },
  
  // Image optimization settings
  images: {
    // Re-enable Next.js image optimization (big LCP win)
    unoptimized: true,
  },
  
  async redirects() {
    return [
      {
        source: "/blogs/[slug]",
        destination: "/blogs",
        permanent: true,
      },
    ];
  },
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    // Enable modern bundling for faster builds
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@headlessui/react',
      'react-select',
      'formik',
      'axios',
    ],
  },
  
  // Production-only optimizations
  ...(process.env.NODE_ENV === "production" ? {
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'], // Keep errors and warnings
      },
    },
    // Standalone output for better production deployments
    output: 'standalone',
  } : {}),
};
