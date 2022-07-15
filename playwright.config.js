const config = {
    outputDir: './test-results',
    use: {
      baseURL: 'http://localhost:5500',
      browserName: 'firefox',
      headless: false,
      viewport: { width: 600, height: 800 },
      video: 'on',
      launchOptions: {
        slowMo: 500,
      },
    },
  };
  
  module.exports = config;