<template>
	<div class="header">
		<ul class="header-menu">
			<li
				v-for="(item,index) in menus"
				:key="index"
				:class="[index==menus.length-1 ? 'active':'']"
				@click="menuNav(item)"
			>
				{{ item.menu_name }}
			</li>
		</ul>
		<div
			v-if="adminer"
			class="user-info"
		>
			<el-dropdown
				trigger="click"
				@command="handleCommand"
			>
				<div class="el-dropdown-link">
					{{ adminer.name ? adminer.name : adminer.phone }}
					<i class="el-icon-caret-bottom" />
					<img
						v-if="adminer.photo"
						:src="''+commonPath.route_path+commonPath.photo_path+adminer.photo+''"
						class="avatar"
					>
					<img
						v-else
						src="./img/none.jpg"
						class="avatar"
					>
				</div>
				<el-dropdown-menu slot="dropdown">
					<!-- <el-dropdown-item command="modifyPwd">
            <el-button type="text">修改密码</el-button>
          </el-dropdown-item> -->
					<el-dropdown-item command="logout">
						退出
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<el-dialog
			title="密码修改"
			:visible.sync="dialogFormVisible"
			width="40%"
			center
		>
			<el-form
				ref="passwordForm"
				:model="passwordForm"
				:rules="rules"
			>
				<el-form-item
					label="输入原密码"
					:label-width="formLabelWidth"
					prop="original_pwd"
				>
					<el-input
						v-model="passwordForm.original_pwd"
						type="password"
						autocomplete="off"
						maxlength="20"
					/>
				</el-form-item>
				<el-form-item
					label="输入新密码"
					:label-width="formLabelWidth"
					prop="new_pwd"
				>
					<el-input
						v-model="passwordForm.new_pwd"
						type="password"
						autocomplete="off"
						maxlength="20"
					/>
				</el-form-item>
				<el-form-item
					label="确认新密码"
					:label-width="formLabelWidth"
					prop="confirm_new_pwd"
				>
					<el-input
						v-model="passwordForm.confirm_new_pwd"
						type="password"
						autocomplete="off"
						maxlength="20"
					/>
				</el-form-item>
			</el-form>
			<div
				slot="footer"
				class="dialog-footer"
			>
				<el-button @click="dialogFormVisible = false">
					取 消
				</el-button>
				<el-button
					type="primary"
					@click="changePwd"
				>
					确 定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
const domain = "";

import Storage from "@/util/storage";

export default {
	data() {
		return {
			menus: [
				{menu_name: "办公系统", path: domain + "/heroera/mhi/pc/#/app/office/todo"},
				{menu_name: "空间运营系统", path: domain + "/newmis/pages/autoroute?page=contract/contract.php#/app/contract/contractlist"},
				{menu_name: "空间产品系统", path: domain + "/cms/space_management_system/product/list"},
				{menu_name: "财务系统", path: domain + "/newmis/pages/autoroute?page=finance/finance.php#/app/finance/financemanage"},
				{menu_name: "官网管理系统", path: domain + "/cms/hi_coffice_management_system/banner"},
				{menu_name: "资产主数据管理", path: ""}
			],
			activeIndex2: "1",
			dialogFormVisible: false,
			passwordForm: {
				original_pwd: "",
				new_pwd: "",
				confirm_new_pwd: "",
			},
			formLabelWidth: "100px",
			rules: {
				original_pwd: [
					{required: true, message: "请输入原密码", trigger: "blur"},
					{min: 6, max: 20, message: "长度在 6 到 20 个字符内", trigger: "blur"}
				],
				new_pwd: [
					{required: true, message: "请输入新密码", trigger: "blur"},
					{min: 6, max: 20, message: "长度在 6 到 20 个字符内", trigger: "blur"}
				],
				confirm_new_pwd: [
					{required: true, message: "请确认新密码", trigger: "blur"},
					{min: 6, max: 20, message: "长度在 6 到 20 个字符内", trigger: "blur"}
				],
			}
		};
	},
	computed: {
		adminer() {
			return this.$store.getters.adminer;
		}
	},
	created() {
		let commonPath = Storage.getItem("key_common_path");

		this.commonPath = commonPath ? commonPath : {};
	},
	methods: {
		handleSelect(key) {
			this.$store.commit("SET_MSG", key);
		},
		menuNav(item) {
			window.location.href = item.path;
		},
		handleCommand(command) {
			let commandMap = {
				modifyPwd: () => {
					this.passwordForm = {
						original_pwd: "",
						new_pwd: "",
						confirm_new_pwd: "",
					};
					this.dialogFormVisible = true;
				},
				logout: () => {
					this.$confirm("退出后将返回管理员登录界面, 是否退出登录?", "真的要退出吗？", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						this.$store.commit("adminlogout");
						this.$router.push("/login");
					}).catch(() => {

					});
				}
			};

			return commandMap[command]();
		},
		changePwd() {
			// 不提供修改密码功能。可以去办公系统里修改
		}
	}
};
</script>

<style scoped lang="less">
.header {
	display: flex;
	justify-content: space-between;
	background-color: #FFFFFF;
  font-size: 16px;
  height: 60px;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05);

  ul, li {
    list-style: none;
    margin: 0;
  }
  ul.header-menu {
    color: #3a3f51;
    display: flex;
    height: 60px;

    li {
      cursor: pointer;
      margin-left: 20px;
      border-bottom: 4px solid transparent;
      display: flex;
      align-items: center;
      font-weight: 800;
      padding: 0 10px;
    }

    li.active {
      border-bottom: 4px solid #0083fd;
    }

    li:nth-child(1) {
      margin-left: 0;
    }
  }

	.el-menu.el-menu--horizontal {
		border-bottom: none;
		.el-menu-item {
			font-size: 16px;
		}
	}
	.system-name {
		width:15%;
		display: flex;
		align-items: center;
	}
	.system-name,.user-name {
		color: #fff;
		padding: 0 20px;
		height: 58px;
		.el-dropdown {
			cursor: pointer;
			color: #fff;
			font-size: 16px;
		}
	}
	.user-info {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333333;
    margin-right: 30px;
    cursor: pointer;

    .el-dropdown-link {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .avatar {
      width:30px;
      height:30px;
      border-radius: 50%;
      margin-left: 10px;
    }
	}
	.el-menu-demo {
		width: 80%;
	}
}
</style>
