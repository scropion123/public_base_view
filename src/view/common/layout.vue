<template>
  <el-container>
    <!-- 左侧导航 -->
    <el-aside class="aside-container"><Sidebar></Sidebar></el-aside>
    <el-container>
      <!-- 顶部导航 -->
      <el-header><Header></Header></el-header>
      <el-main>
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 头部
import Header from "@/view/common/header";
// 侧边栏
import Sidebar from "@/view/common/sidebar";

export default {
	components: {
		Header,
		Sidebar
	}
};
</script>

<style scoped lang="less">
  .aside-container {
    background-color: #1c2b36;
  }
	.el-main {
		padding: 0 20px;
	}
	.fade-enter-active,.fade-leave-active{
		transition: opacity .5s;
	}
	.fade-enter{
		opacity: 0;
	}
	.fade-leave{
		opacity: 1;
	}
	.fade-leave-active {
		opacity:0;
	}
</style>