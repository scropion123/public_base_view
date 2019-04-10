<template>
	<div class="wrapper">
		<page-title :title="(operatorId==0?&quot;新增&quot;:&quot;编辑&quot;)+&quot;运营商&quot;" />
		<div class="content">
			<el-form
				ref="addForm"
				:model="addForm"
				:rules="rules"
				label-width="150px"
			>
				<el-form-item
					label="运营商名称(品牌名)"
					prop="operator_name"
				>
					<el-input
						v-model="addForm.operator_name"
						placeholder="请输入运营商名称,20字以内"
						maxlength="20"
					/>
				</el-form-item>
				<el-form-item
					label="公司名称"
					prop="company_name"
				>
					<el-select
						v-model="addForm.company_name"
						filterable
						remote
						placeholder="请输入公司名称关键字搜索"
						:remote-method="querySearchAsync"
						value-key="org_name"
						:loading="loading"
						@change="handleSelectCom"
					>
						<el-option
							v-for="(item,index) in comOptionArr"
							:key="index"
							:label="item.org_name"
							:value="item"
						/>
					</el-select>
					<span>
						(机构若不存在，可直接<el-button
							type="text"
							@click="addOrg(1)"
						>
							新增
						</el-button>)
					</span>
				</el-form-item>
				<el-form-item
					label="公司地址"
					prop="comAddressSelected"
				>
					<el-cascader
						v-model="addForm.comAddressSelected"
						placeholder="请选择公司地址区域"
						clearable
						:options="provinceCityAreaList"
					/>
				</el-form-item>
				<el-form-item
					label=""
					prop="address"
				>
					<el-input
						v-model="addForm.address"
						placeholder="请输入公司详细地址,30字以内"
						maxlength="30"
					/>
				</el-form-item>
				<el-form-item
					label="总部所在城市"
					prop="headquartersSelected"
				>
					<el-cascader
						v-model="addForm.headquartersSelected"
						placeholder="请选择总部所在地址"
						clearable
						:options="provinceCityList"
					/>
				</el-form-item>
				<el-form-item
					label="公司简介"
					prop="introduce"
					placeholder="请输入公司简介"
				>
					<el-input
						v-model="addForm.content"
						type="textarea"
						:rows="5"
						placeholder="1000字以内"
						maxlength="1000"
					/>
				</el-form-item>
				<el-form-item label="子/分公司名称">
					<div
						v-for="(data, index) in addForm.operator_company"
						:key="index"
						class="m-b-xs"
					>
						<div class="flex">
							<el-select
								v-model="data.company_name"
								filterable
								remote
								placeholder="请输入子/分公司名称关键字搜索"
								:remote-method="querySearchAsync"
								value-key="org_name"
								:loading="loading"
								@focus="searchFocus(index)"
								@change="handleSelect"
							>
								<el-option
									v-for="(item,index) in comOptionArr"
									:key="index"
									:label="item.org_name"
									:value="item"
								/>
							</el-select>
							<el-button
								v-if="index==0"
								type="primary"
								icon="el-icon-plus"
								size="mini"
								@click="addCom"
							/>
							<el-button
								v-else
								type="danger"
								icon="el-icon-minus"
								size="mini"
								@click="delCom(index)"
							/>
						</div>
						<span>
							(机构若不存在，可直接<el-button
								type="text"
								@click="addOrg(2, index)"
							>
								新增
							</el-button>)
						</span>
					</div>
				</el-form-item>
			</el-form>
			<div
				slot="footer"
				class="btn-group"
			>
				<el-button @click="goBack">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="addOperatorSubmit('addForm')"
				>
					确 定
				</el-button>
			</div>
		</div>
		<el-dialog
			title="新增机构"
			:visible.sync="addOrgModal"
		>
			<el-form
				ref="orgForm"
				:model="orgForm"
				:rules="orgRules"
				label-width="150px"
			>
				<el-form-item
					label="机构名称"
					prop="name"
				>
					<el-select
						v-model="orgForm.name"
						filterable
						remote
						placeholder="输入5个字后，将从天眼查带出"
						:remote-method="querySearchOrg"
						value-key="name"
						:loading="loading"
						@change="handleSelectOrg"
					>
						<el-option
							v-for="(item,index) in tyOrgOptionArr"
							:key="index"
							:label="item.name"
							:value="item"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="信用代码/身份证号"
					prop="creditCode"
				>
					<el-input
						v-model="orgForm.creditCode"
						placeholder="请输入信用代码/身份证号"
						maxlength="20"
						disabled
					/>
				</el-form-item>
			</el-form>
			<div
				slot="footer"
				class="dialog-footer"
			>
				<el-button @click="resetForm('orgForm')">
					取 消
				</el-button>
				<el-button
					type="primary"
					@click="saveOrg('orgForm')"
				>
					确 定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import {
	getDicAreaCode, getProvinceCityList, operatorAddSubmit, operatorDetail, operatorEditSubmit, getOrgList, getTyOrgList, getTyOrgDetail, ownOrgAdd,
} from "@/api/api";
export default {
	components: {
		pageTitle,
	},
	data() {
		return {
			operatorId: this.$route.params.id,
			provinceCityAreaList: [],
			provinceCityList: [],
			comIndex: 0,
			addOrgModal: false,
			addOrgType: 0,
			loading: false,
			comOptionArr: [],
			tyOrgOptionArr: [],
			addForm: {
				operator_name: "",
				company_name: "",
				company_id: "",
				comAddressSelected: [],
				address: "",
				headquartersSelected: [],
				content: "",
				operator_company: [{
					company_id: "",
					company_name: "",
				}],
			},
			rules: {
				operator_name: [
					{required: true, message: "请输入运营商名称", trigger: "blur"},
				],
				company_name: [
					{required: true, message: "请输入公司名称", trigger: "change"},
				],
				comAddressSelected: [
					{required: true, message: "请选择公司地址", trigger: "change"}
				],
				address: [
					{required: true, message: "请输入公司详细地址", trigger: "blur"},
				],
			},
			orgForm: {
				name: "",
				creditCode: "",
			},
			orgRules: {
				name: [
					{required: true, message: "请搜索选择企业名称", trigger: "blur"},
				],
				creditCode: [
					{required: true, message: "请输入信用代码/身份证号", trigger: "blur"},
				],
			},
		};
	},
	created() {
		this.getProvinceCityDistrict();
		this.getProvinceCityList();
		if (this.operatorId > 0) {
			this.getOperatorDetail();
		}
	},
	methods: {
		getProvinceCityDistrict() {
			getDicAreaCode({}).then(res => {
				this.provinceCityAreaList = res.data;
			});
		},
		getProvinceCityList() {
			getProvinceCityList({}).then(res => {
				this.provinceCityList = res.data;
			});
		},
		// 增加子公司
		addCom() {
			this.addForm.operator_company.push({
				company_id: "",
				company_name: "",
			});
		},
		// 删除子公司
		delCom(index) {
			this.addForm.operator_company.splice(index, 1);
		},
		// 新增机构
		addOrg(type, index) {
			// type区分增加机构是到总公司还是子公司，1总公司，2子公司
			this.addOrgType = type;
			this.comIndex = index;
			this.addOrgModal = true;
		},
		// 子公司搜索框获取焦点
		searchFocus(index) {
			this.comIndex = index;
		},
		// 输入关键字选择企业
		querySearchAsync(queryString) {
			if (queryString) {
				let params = {
					org_name: queryString,
				};

				this.loading = true;
				getOrgList(params).then(res => {
					this.loading = false;
					this.comOptionArr = res.data;
				}).catch(err => {
					this.$message.warning(err.message || "未搜索到对应公司，请更换关键词搜索!");
				});
			}
		},
		// 选择子公司后处理数据
		handleSelect(item) {
			if (this.comNoRepeat(item)) {
				this.addForm.operator_company[this.comIndex].company_id = item.org_id;
				this.addForm.operator_company[this.comIndex].company_name = item.org_name;
			} else {
				this.$message.warning("所选子公司已存在!");
				this.addForm.operator_company[this.comIndex].company_id = "";
				this.addForm.operator_company[this.comIndex].company_name = "";
			}
		},
		// 子公司去重
		comNoRepeat(item) {
			let isRepeat = true;

			for (let data of this.addForm.operator_company) {
				if (item.org_id === data.company_id) {
					isRepeat = false;
				}
			}
			return isRepeat;
		},
		// 选择总公司
		handleSelectCom(item) {
			this.addForm.company_id = item.org_id;
			this.addForm.company_name = item.org_name;
			this.$forceUpdate();
		},
		// 搜索天眼查企业
		querySearchOrg(queryString) {
			if (queryString && queryString.length >= 5) {
				let params = {
					org_name: queryString,
				};

				this.loading = true;
				getTyOrgList(params).then(res => {
					this.loading = false;
					this.tyOrgOptionArr = res.data;
				}).catch(err => {
					this.$message.warning(err.message || "未搜索到对应公司，请更换关键词搜索!");
				});
			} else {
				this.$message.warning("请输入至少5个字关键词搜索!");
			}
		},
		// 选择天眼查企业后处理数据
		handleSelectOrg(item) {
			getTyOrgDetail({org_name: item.name}).then(res => {
				this.orgForm = res.data;
			}).catch(err => {
				this.$message.warning(err.message || "操作失败，请稍后重试!");
			});
		},
		resetForm(formName) {
			this.addOrgModal = false;
			this.$refs[formName].resetFields();
		},
		// 获取详情
		getOperatorDetail() {
			operatorDetail({id: this.operatorId}).then(res => {
				this.addForm = res.data;
				this.addForm.comAddressSelected = [res.data.address_province_code, res.data.address_city_code, res.data.address_district_code];
				this.addForm.headquartersSelected = [res.data.province_code, res.data.city_code];
				if (!this.addForm.operator_company || this.addForm.operator_company.length == 0) {
					this.addForm.operator_company = [{
						company_id: "",
						company_name: "",
					}];
				}
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
		addOperatorSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.addForm.comAddressSelected && this.addForm.comAddressSelected.length == 0) {
						this.$message({
							message: "请选择公司地址！",
							type: "warning"
						});
						return;
					}
					if (this.addForm.operator_company && this.addForm.operator_company.length > 1) {
						for (let item of this.addForm.operator_company) {
							if (!item.company_id || !item.company_name) {
								this.$message({
									message: "请选择子/分公司名称！",
									type: "warning"
								});
								return;
							}
						}
					}
					let params = {
						operator_name: this.addForm.operator_name,
						company_name: this.addForm.company_name,
						company_id: this.addForm.company_id,
						content: this.addForm.content,
						address: this.addForm.address,
						address_province_code: this.addForm.comAddressSelected[0],
						address_city_code: this.addForm.comAddressSelected[1],
						address_district_code: this.addForm.comAddressSelected[2],
						province_code: this.addForm.headquartersSelected[0],
						city_code: this.addForm.headquartersSelected[1],
						operator_company: this.addForm.operator_company,
					};

					if (this.operatorId == 0) {
						operatorAddSubmit(params).then(res => {
							this.$message({
								message: res.message,
								type: "success"
							});
							this.$router.push("/opt/operator/detail/" + res.data[0]);
						}).catch(err => {
							this.$message({
								message: err.message,
								type: "error"
							});
						});
					} else {
						params.id = this.operatorId;
						operatorEditSubmit(params).then(res => {
							this.$message({
								message: res.message,
								type: "success"
							});
							this.$router.push("/opt/operator/detail/" + this.operatorId);
						}).catch(err => {
							this.$message({
								message: err.message,
								type: "error"
							});
						});
					}
				} else {
					return false;
				}
			});
		},
		saveOrg(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (!this.orgForm.id) {
						this.$message.warning("请输入至少5个字关键词搜索选择机构!");
						return;
					}
					ownOrgAdd(this.orgForm).then(res => {
						this.$message({
							message: res.message,
							type: "success"
						});
						this.addOrgModal = false;
						this.resetForm("orgForm");
						this.orgForm = {name: "", creditCode: ""};
						if (this.addOrgType == 1) {
							this.addForm.company_name = res.data.org_name;
							this.addForm.company_id = res.data.org_id;
						} else if (this.addOrgType == 2) {
							this.addForm.operator_company[this.comIndex].company_id = res.data.org_id;
							this.addForm.operator_company[this.comIndex].company_name = res.data.org_name;
						}
					}).catch(err => {
						this.$message({
							message: err.message,
							type: "error"
						});
					});
				}
			});
		},
		goBack() {
			this.$router.push("/opt/operator/list");
		},
	},
};
</script>

<style scoped lang="less">
.el-autocomplete,.el-select {
	width: 100%;
}
.content {
	padding: 0 100px;
}
.btn-group {
    text-align: center;
}
.m-b-xs {
	margin-bottom: 5px;
}
</style>