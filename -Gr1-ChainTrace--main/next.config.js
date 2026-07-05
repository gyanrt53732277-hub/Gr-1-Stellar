/** @type {import('next').NextConfig} */  
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    // Mark native node modules as externals
    config.externals = [...(config.externals || []), {
      'sodium-native': 'commonjs sodium-native',
      'require-addon': 'commonjs require-addon',
    }];
    return config;
  },
};

module.exports = nextConfig;
