import Vue from "vue";
import Router from "vue-router";
// 引入storage
import storage from "@/util/storage";

Vue.use(Router);

const router = new Router({
	// 去除#
	mode: "history",
	// 服务器存放目录，默认/，--开发环境去掉
	base: process.env.NODE_ENV === "production" ? "/cms/public_base_info_view/" : "/",
	routes: [
		{
			path: "/",
			redirect: "/base",
			component: () => import("@/view/common/layout"),
			children: [
				{
					path: "/base",
					menu_name: "基础数据管理",
					meta: {requiresAuth: true},
					component: () => import("@/view/index"),
					children: [
						{
							path: "/base/area/list",
							menu_name: "行政区划",
							name: "area",
							meta: {requiresAuth: true},
							component: () => import("@/view/base_area/index"),
							children: [
								{
									path: "/base/area/list",
									name: "areaList",
									meta: {requiresAuth: true},
									component: () => import("@/view/base_area/list")
								}, {
									path: "/base/area/add/:id",
									name: "areaAdd",
									meta: {requiresAuth: true},
									component: () => import("@/view/base_area/add")
								}, {
									path: "/base/area/detail/:id",
									name: "areaDetail",
									meta: {requiresAuth: true},
									component: () => import("@/view/base_area/detail")
								},
							]
						},
						{
							path: "/base/business/list",
							menu_name: "商圈",
							name: "business",
							meta: {requiresAuth: true},
							component: () => import("@/view/base_business/index"),
							children: [
								{
									path: "/base/business/list",
									name: "businessList",
									meta: {requiresAuth: true},
									component: () => import("@/view/base_business/list")
								}, {
									path: "/base/business/add/:id",
									name: "businessAdd",
									meta: {requiresAuth: true},
									component: () => import("@/view/base_business/add")
								}, {
									path: "/base/business/detail/:id",
									name: "businessDetail",
									meta: {requiresAuth: true},
									component: () => import("@/view/base_business/detail")
								},
							]
						},
						{
							path: "/base/metro/list",
							menu_name: "地铁",
							meta: {requiresAuth: true},
							component: () => import("@/view/metro/list")
						},
						{
							path: "/base/property/list",
							menu_name: "物业",
							meta: {requiresAuth: true},
							component: () => import("@/view/property/list")
						},
						{
							path: "/base/office_building/list",
							redirect: "/base/office_building/list",
							menu_name: "写字楼",
							meta: {requiresAuth: true},
							component: () => import("@/view/index"),
							children: [
								{
									path: "/base/office_building/list",
									meta: {requiresAuth: true},
									component: () => import("@/view/office_building/list")
								},
								{
									path: "/base/office_building/add",
									name: "add_office_building",
									meta: {requiresAuth: true},
									component: () => import("@/view/office_building/index")
								},
								{
									path: "/base/office_building/edit/:id",
									name: "edit_office_building",
									meta: {requiresAuth: true},
									component: () => import("@/view/office_building/index")
								},
								{
									path: "/base/office_building/detail/:id",
									name: "office_building_detail",
									meta: {requiresAuth: true},
									component: () => import("@/view/office_building/index")
								}
							]
						}
					]
				},
				{
					path: "/opt",
					menu_name: "运营商管理",
					meta: {requiresAuth: true},
					component: () => import("@/view/index"),
					children: [
						{
							path: "/opt/operator/list",
							menu_name: "运营商列表",
							name: "operator",
							meta: {requiresAuth: true},
							component: () => import("@/view/operator/index"),
							children: [
								{
									path: "/opt/operator/list",
									name: "operatorList",
									meta: {requiresAuth: true},
									component: () => import("@/view/operator/list")
								}, {
									path: "/opt/operator/add/:id",
									name: "operatorAdd",
									meta: {requiresAuth: true},
									component: () => import("@/view/operator/add")
								}, {
									path: "/opt/operator/detail/:id",
									name: "operatorDetail",
									meta: {requiresAuth: true},
									component: () => import("@/view/operator/detail")
								},
							]
						},
						{
							path: "/opt/store/list",
							menu_name: "门店列表",
							name: "store",
							meta: {requiresAuth: true},
							component: () => import("@/view/store/index"),
							children: [
								{
									path: "/opt/store/list",
									name: "storeList",
									meta: {requiresAuth: true},
									component: () => import("@/view/store/list")
								}, {
									path: "/opt/store/add/:id",
									name: "storeAdd",
									meta: {requiresAuth: true},
									component: () => import("@/view/store/add")
								}, {
									path: "/opt/store/detail/:id",
									name: "storeDetail",
									meta: {requiresAuth: true},
									component: () => import("@/view/store/detail")
								},
							]
						}
					]
				}
			]
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/view/login/login"),
		},
		{
			path: "*",
			component: () => import("@/view/404/index"),
		}
	]
});

// 路由拦截
// requireLogin： true需要权限，false不需要权限
router.beforeEach((to, from, next) => {
	if (to.matched.some(res => res.meta.requiresAuth)) {
		// 判断是否需要登录权限
		if (storage.getItem("currentUser")) {
			next();
		} else {
			// 没登录则跳转到登录界面
			next({
				path: "/login"
			});
		}
	} else {
		next();
	}

	next();
});

export default router;