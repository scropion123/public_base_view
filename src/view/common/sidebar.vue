<template>
  <div class="sidebar-container">
    <div class="logo-container">
      <img src="./img/logo.png" />
    </div>
    <el-menu class="menu-container" background-color="#1c2b36" text-color="#FFFFFF" unique-opened="" :default-active="activeMenu">
      <template v-for="(item, index) in routes.children">
        <template v-if="item.children && item.children.length > 0">
          <el-submenu :key="index" :index="item.path">
            <template slot="title">
              {{item.menu_name}}
            </template>
            <router-link v-for="(subItem,subIndex) in item.children" :key="subIndex" :to="subItem.path">
              <el-menu-item v-if="item.menu_name" :index="subItem.path" >
                  {{subItem.menu_name}}
              </el-menu-item>
            </router-link>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item v-if="item.menu_name" :key="index" :index="item.path">{{item.menu_name}}</el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import router from "@/router/index.js";
export default {
	data() {
		return {
			routes: this._getRoutes()
		};
	},
	created() {

	},
	computed: {
		navIndex() {
			return this.$store.state.navIndex;
		},
		activeMenu() {
			let _path = this.$route.path;
			let _arr = _path.split("/");

			return "/" + [_arr[1], _arr[2], "list"].join("/");
		}
	},
	methods: {
		_getRoutes: () => router.options.routes[0]
	}
};
</script>

<style scoped lang="less">
.sidebar-container {
  background-color: #1c2b36;
}
.menu-container {
  border-right: 0;
}
.logo-container {
  height: 66px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 66px;
  }
}
</style>