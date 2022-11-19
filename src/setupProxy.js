const { createProxyMiddleware } = require('http-proxy-middleware');

// "proxy": "http://123.57.91.195",

module.exports = function (app) {

    app.use(
        '/daka',
        createProxyMiddleware({
            // target: 'http://localhost:8081',
            target: 'https://123.57.91.195',
            changeOrigin: true,
            secure: false,
        })
    );
};


