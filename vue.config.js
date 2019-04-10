module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/cms/public_base_info_view/" : "/",
	devServer: {
		proxy: {
			"/api": {
				target: "http://orp003.dev.heroera.com/",
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			}
		}
	}
};