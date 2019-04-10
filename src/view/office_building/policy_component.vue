<template>
	<div
		v-loading="loading"
		class="baseinfo-container"
	>
		<!-- 政策内容 -->
		<el-form
			ref="form"
			class="policy-content"
			label-width="120px"
			:model="officeBuilding"
		>
			<el-form-item
				label="是否有政策支持"
				prop="policy_support"
				:rules="supportFlagRule"
			>
				<div v-if="isAdd||isEdit||isCreate||isDetailEdit">
					<el-radio
						v-model="officeBuilding.policy_support"
						label="1"
						@change="policySupportChangeRadio"
					>
						是
					</el-radio>
					<el-radio
						v-model="officeBuilding.policy_support"
						label="2"
						@change="policySupportChangeRadio"
					>
						否
					</el-radio>
				</div>
				<div v-else>
					{{ officeBuilding.policy_support=="1"?"是":"否" }}
				</div>
			</el-form-item>
			<div v-if="isAdd||isEdit||isCreate||isDetailEdit">
				<div
					v-for="(item, index) in officeBuilding.policy_content"
					:key="index"
					class="flex-row"
				>
					<div class="flex-1 policy-item">
						<el-form-item :label="'第' + (index+1) + '条政策'" />
						<el-form-item
							label="政策支持链接"
							:prop="'policy_content.' + index + '.url'"
							:rules="url_rule"
						>
							<el-input v-model="officeBuilding.policy_content[index].url" />
						</el-form-item>
						<el-form-item
							label="政策支持内容"
							:prop="'policy_content.' + index + '.content'"
							:rules="content_rule"
						>
							<el-input
								v-model="officeBuilding.policy_content[index].content"
								type="textarea"
								placeholder="30字以内"
								maxlength="30"
							/>
						</el-form-item>
					</div>
					<div class="row-button-container">
						<el-button
							v-if="officeBuilding.policy_content.length != 1"
							class="add-price-button"
							type="danger"
							icon="el-icon-minus"
							circle
							@click="removePolicy(index)"
						/>
						<el-button
							v-if="(index==officeBuilding.policy_content.length - 1) && officeBuilding.policy_content.length < 10"
							class="add-price-button"
							type="primary"
							icon="el-icon-plus"
							circle
							@click="addPolicy"
						/>
					</div>
				</div>
			</div>
			<div v-else>
				<div
					v-for="(item, index) in officeBuilding.policy_content"
					:key="index"
				>
					<div class="flex-1 policy-item">
						<div>第{{ index+1 }}条政策</div>
						<div>政策链接：{{ item.url }}</div>
						<div>政策内容：{{ item.content }}</div>
					</div>
				</div>
			</div>
		</el-form>
		<div
			v-if="officeProject.is_administrator || isCreate"
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
				v-if="isAdd||isEdit||isCreate||isDetailEdit"
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
import {
	saveBuilding
} from "@/api/officeApi.js";

export default {
	props: {
		isCreate: {
			type: Boolean,
			default: false
		},
		index: Number
	},
	data() {
		let _url_rule = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("政策链接不能为空"));
			} else {
				callback();
			}
		};
		let _content_rule = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("政策内容不能为空"));
			} else {
				callback();
			}
		};

		let _support_flag_rule = (rule, value, callback) => {
			if (!value || value == "0") {
				return callback(new Error("请选择是否有政策支持"));
			} else {
				callback();
			}
		};

		return {
			url_rule: [
				{validator: _url_rule, trigger: "blur"}
			],
			content_rule: [
				{validator: _content_rule, trigger: "blur"}
			],
			supportFlagRule: [
				{validator: _support_flag_rule, trigger: ["blur", "change"]}
			],
			isAdd: false,
			isDetail: false,
			isEdit: false,
			isDetailEdit: false,
			loading: false
		};
	},
	computed: {
		officeProject() {
			return this.$store.getters.officeProject;
		},
		officeBuilding() {
			return this.$store.getters.officeBuilding[this.index];
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
		addPolicy() {
			this.$refs["form"].validate((valid) => {
				if (valid) {
					this.officeBuilding.policy_content.push({content: "", url: ""});
				}
			});
		},
		removePolicy(index) {
			this.officeBuilding.policy_content.splice(index, 1);
		},
		// 编辑
		edit() {
			this.isDetailEdit = true;
		},
		// 取消编辑
		cancel() {
			this.isDetailEdit = false;
			this.$emit("updateOfficeBuilding");
		},
		policySupportChangeRadio() {
			if (this.officeBuilding.policy_support == 1) {
				if (this.officeBuilding.policy_content.length == 0) {
					this.officeBuilding.policy_content.push({
						url: "",
						content: ""
					});
				}
			} else {
				this.officeBuilding.policy_content = [];
			}
		},
		// 保存
		save() {
			this.$refs["form"].validate((valid) => {
				if (valid) {
					this.loading = true;
					let _data = {
						project_id: this.$route.params.id,
						step: 3,
						id: this.officeBuilding.id,
						policy_support: this.officeBuilding.policy_support
					};

					if (this.officeBuilding.policy_support == "1") {
						_data.policy_content = this.officeBuilding.policy_content;
					}

					saveBuilding(_data).then(() => {
						this.loading = false;
						this.$message.success("保存成功");
						this.$emit("updateOfficeBuilding");
					}).catch((res) => {
						this.$message.error(res.message ? res.message : "保存失败");
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
.label-class {
  width: 100px;
  margin-right: 20px;
}
.policy-content {
  margin-top: 20px;
}
.policy-item {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>