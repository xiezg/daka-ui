const { createProxyMiddleware } = require('http-proxy-middleware');

// "proxy": "http://123.57.91.195",

module.exports = function (app) {

    app.use(
        '/daka',
        createProxyMiddleware({
            // target: 'http://host.docker.internal:8081',     //Mac 环境下，在docker内访问宿主机
            target: "https://36.138.164.17:8888",
            changeOrigin: true,
            secure: false,
        })
    );
};


