import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/global.less";
// 引入百度地图
import BaiduMap from "vue-baidu-map";

Vue.use(BaiduMap, {
	// ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
	ak: "8ONhFRpez6afh6oqgeLMke5QLGfljsOU"
});

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount("#app");
