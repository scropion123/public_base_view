<template>
	<div class="baseinfo-container">
		<el-form
			ref="developerForm"
			:model="officeProject"
		>
			<!-- 开发商联系人 -->
			<div v-if="isAdd||isEdit||isDetailEdit">
				<div v-if="!officeProject.developer_list || officeProject.developer_list.length == 0">
					<el-button
						class="add-price-button"
						type="primary"
						icon="el-icon-plus"
						circle
						@click="addDeveloper(-1)"
					/>
				</div>
				<div
					v-for="(item, index) in officeProject.developer_list"
					:key="index"
					class="flex-row"
				>
					<el-form-item
						label="联系人"
						label-width="100px"
						:prop="'developer_list.' + index + '.user_name'"
						:rules="contactRules"
					>
						<el-input
							v-model="officeProject.developer_list[index].user_name"
							placeholder="请输入联系人"
						/>
					</el-form-item>
					<el-form-item
						label="联系电话"
						label-width="100px"
						:prop="'developer_list.' + index + '.user_tel'"
						:rules="telRules"
					>
						<numberInput
							:is-decimal="false"
							:intlength="11"
							:value="String(officeProject.developer_list[index].user_tel)"
							@update:value="officeProject.developer_list[index].user_tel=$event"
						/>
					</el-form-item>
					<div class="row-button-container">
						<el-button
							v-if="officeProject.developer_list && officeProject.developer_list.length > 0"
							class="add-price-button"
							type="danger"
							icon="el-icon-minus"
							circle
							@click="removeDeveloper(index)"
						/>
						<el-button
							v-if="index==officeProject.developer_list.length - 1"
							class="add-price-button"
							type="primary"
							icon="el-icon-plus"
							circle
							@click="addDeveloper(index)"
						/>
					</div>
				</div>
			</div>
			<div v-if="isDetail && !isDetailEdit && officeProject.developer_list && officeProject.developer_list.length > 0">
				<el-form>
					<div
						v-for="(item, index) in officeProject.developer_list"
						:key="index"
					>
						<div
							v-if="item.user_name && item.user_tel"
							class="flex-row"
						>
							<el-form-item
								class="flex-1"
								label="联系人"
							>
								{{ item.user_name }}
							</el-form-item>
							<el-form-item
								class="flex-1"
								label="联系电话"
							>
								{{ item.user_tel }}
							</el-form-item>
						</div>
					</div>
				</el-form>
			</div>
		</el-form>
		<div
			v-if="officeProject.is_administrator"
			class="button-container"
		>
			<el-button
				v-if="isDetailEdit"
				type="danger"
				@click="cancel"
			>
				取消
			</el-button>
			<el-button
				v-if="isAdd||isEdit||isDetailEdit"
				type="primary"
				@click="save"
			>
				保存
			</el-button>
			<el-button
				v-else
				type="primary"
				@click="edit"
			>
				编辑
			</el-button>
		</div>
	</div>
</template>
<script>
import numberInput from "@/components/input_component.vue";
import util from "@/util/util";
import {
	updateDeveloper
} from "@/api/officeApi.js";

export default {
	components: {
		numberInput,
	},
	props: {
		index: Number
	},
	data() {
		let nameValidator = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("开发商联系人不能为空"));
			} else {
				callback();
			}
		};
		let phoneValidator = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("开发商联系手机不能为空"));
			} else {
				if (!util.phoneReg.test(value)) {
					callback(new Error("请输入正确的开发商联系手机"));
				} else {
					callback();
				}
			}
		};

		return {
			isAdd: false,
			isDetail: false,
			isEdit: false,
			isDetailEdit: false,
			telRules: [
				{validator: phoneValidator, trigger: "blur"}
			],
			contactRules: [
				{validator: nameValidator, trigger: "blur"}
			],
		};
	},
	computed: {
		officeProject() {
			return this.$store.getters.officeProject;
		}
	},
	created() {
		if (this.$route.name == "add_office_building") {
			this.isAdd = true;
			this.isDetail = false;
			this.isEdit = false;
		} else if (this.$route.name == "edit_office_building") {
			this.isAdd = false;
			this.isDetail = false;
			this.isEdit = true;
		} else if (this.$route.name == "office_building_detail") {
			this.isAdd = false;
			this.isDetail = true;
			this.isEdit = false;
		}
	},
	methods: {
		addDeveloper() {
			this.$refs["developerForm"].validate((valid) => {
				if (valid) {
					this.officeProject.developer_list.push({
						user_name: "",
						user_tel: ""
					});
				}
			});
		},
		removeDeveloper(index) {
			this.officeProject.developer_list.splice(index, 1);
		},
		// 编辑开发商信息
		edit() {
			this.isDetailEdit = true;
		},
		// 取消编辑
		cancel() {
			this.isDetailEdit = false;
			this.$emit("updateBuilding");
		},
		save() {
			this.$refs["developerForm"].validate((valid) => {
				if (valid) {
					this.loading = true;
					let _data = {
						project_id: this.$route.params.id,
					};

					_data.developer_list = this.officeProject.developer_list;

					updateDeveloper(_data).then(() => {
						this.$emit("updateBuilding");
						this.loading = false;
						this.$message.success("操作成功");
					}).catch(res => {
						this.$message.error(res.message ? res.message : "操作失败");
						this.loading = false;
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url(./common.less);
.row-button-container {
  margin-bottom: 22px;
}
</style>

