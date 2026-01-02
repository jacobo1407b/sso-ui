/** @type {import('next').NextConfig} */


/*const nextConfig = {
  swcMinify: false, // Desactiva la minificación con SWC

  webpack(config) {
    // Desactiva la minificación de Webpack
    config.optimization.minimize = false;

    return config;
  },
};

module.exports = nextConfig;*/

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb' // puedes poner '5mb', '10mb', etc.
    }
  }
};


module.exports = nextConfig;
