import Vue from "vue";
import Vuex from "vuex";
import storage from "@/util/storage";

Vue.use(Vuex);

const state = {
	user: {},
	navIndex: 1,
	filterData: {},
	officeProject: {},
	officeBuilding: []
};

const mutations = {
	// 管理员登录
	adminlogin(state, user) {
		state.user = user;
		// 存储登陆信息
		storage.setItem("currentUser", user);
	},
	// 管理员退出
	adminlogout(state) {
		state.user = {};
		storage.removeItem("currentUser");
	},
	// 导航状态
	set_msg(state, navIndex) {
		state.navIndex = navIndex;
	},
	// 筛选
	filter_data(state, filterData) {
		state.filterData = filterData;
	},

	// 设置写字楼
	setOfficeProject(state, obj) {
		state.officeProject = obj;
	},

	// 写字楼楼栋
	setOfficeBuilding(state, obj) {
		state.officeBuilding = obj;
	}

};

// getters
const getters = {
	adminer: function (state) {
		if (!state.user.id) {
			state.user = storage.getItem("currentUser");
		}
		return state.user;
	},
	// 导航状态
	get_msg: function (state) {
		return state.navIndex;
	},

	officeProject: function (state) {
		return state.officeProject;
	},

	officeBuilding: function (state) {
		return state.officeBuilding;
	}

};

// 创建驱动actions可以使得mutations得以启动
const actions = {
	// 管理员登录
	adminlogin({commit}, data) {
		commit("adminlogin", data);
	},
	// 管理员登录
	adminlogout({commit}) {
		commit("adminlogout");
	},
	// 导航状态
	set_msg(state, navIndex) {
		store.commit("set_msg", navIndex);
	},
};

const store = new Vuex.Store({
	state,
	mutations,
	getters,
	actions
});

export default store;