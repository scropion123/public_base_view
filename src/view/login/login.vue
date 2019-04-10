<template>
	<div class="login-wrap" v-loading="loadingStates">
		<el-form ref="form" :model="form" :rules="rules" label-width="55px" class="form">
			<h1 class="header">运营管理系统</h1>
			<el-form-item
				label="账号"
				prop="uname">
				<el-input v-model="form.uname" placeholder="请填写手机号码" maxlength="11"></el-input>
			</el-form-item>
			<el-form-item
				label="密码"
				prop="pwd">
				<el-input v-model="form.pwd" type="password" placeholder="请填写密码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleLogin">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import {
	login
} from "@/api/commonApi";
import Storage from "@/util/storage";

export default {
	data() {
		return {
			form: {
				uname: "",
				pwd: ""
			},
			rules: {
				uname: [
					{required: true, message: "请输入手机号码", trigger: "blur"},
					{
						pattern: /^1[3-9]\d{9}$/,
						message: "请填写正确的手机号码",
						trigger: "blur"
					}
				],
				pwd: [
					{required: true, message: "请输入登录密码", trigger: "blur"},
				]
			},
			loadingStates: false
		};
	},
	methods: {
		handleLogin() {
			this.$refs["form"].validate((valid) => {
				if (valid) {
					this.loadingStates = true;
					let _params = {
						uname: this.form.uname,
						pwd: this.form.pwd,
					};

					login(_params).then(response => {
						let _currentUser = response.data.userInfo;

						// 兼容其他oa环境
						_currentUser.accesstoken = response.data.accesstoken;
						Storage.setItem("accesstoken", response.data.accesstoken);
						this.$store.commit("adminlogin", _currentUser);
						this.$router.push("/base/area/list");
					});
				} else {
					this.$message.error({showClose: true, message: "请检查手机号码和密码是否有误！", type: "warning"});
					return false;
				}
			});
		}
	}
};
</script>

<style scoped>
	.login-wrap{
		position: relative;
		width:100%;
		height:100%;
		background: #f8fafc;
		padding-top: 80px;
		box-sizing: border-box;
	}
	.login-wrap .form {
		width: 400px;
		margin: 0px auto;
		padding: 60px 30px 100px 30px;
		background: #fff;
	}
	.login-wrap .el-button {
		width: 100%;
	}
	.login-wrap .header{
		text-align: center;
		padding: 30px 0px;
	}
</style>