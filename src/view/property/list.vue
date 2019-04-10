<template>
	<div v-loading="loading">
		<div class="wrapper">
			<page-title title="物业列表" />
			<!-- 物业列表 -->
			<div>
				<!-- 搜索 -->
				<div class="filter-row">
					<el-input
						v-model="keyword"
						class="search-input"
						type="input"
						placeholder="请输入物业名称"
						clearable
						@keyup.enter.native="search"
						@clear="search"
					/>
					<el-button
						class="search-button"
						icon="el-icon-search"
						type="primary"
						@click="search"
					>
						搜索
					</el-button>
					<el-button
						v-if="isAdmin"
						class="add-button"
						icon="el-icon-plus"
						type="primary"
						@click="add"
					>
						新增
					</el-button>
				</div>
				<!-- 列表 -->
				<!-- 列表部分 -->
				<div class="list-container">
					<el-table
						stripe
						border
						class="list-table"
						:data="list"
					>
						<el-table-column
							prop="id"
							label="编号"
						/>
						<el-table-column
							prop="company_name"
							label="物业名称"
						/>
						<el-table-column
							prop="phone"
							label="电话"
						/>
						<el-table-column
							label="操作"
						>
							<template slot-scope="scope">
								<el-button
									type="success"
									size="small"
									@click="viewOpt(scope.row)"
								>
									查看操作记录
								</el-button>
								<el-button
									v-if="isAdmin"
									type="primary"
									size="small"
									@click="edit(scope.$index)"
								>
									编辑
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!-- 列表分页 -->
				<div>
					<el-pagination
						background
						:current-page.sync="currentPage"
						:page-size="pageSize"
						layout="total, prev, pager, next, jumper"
						:total="total"
						@current-change="handleCurrentChange"
					/>
				</div>
				<!-- 物业编辑弹窗 -->
				<el-dialog
					v-loading="loading"
					:title="(currentProperty.id?'编辑':'新增')+'物业'"
					:visible.sync="dialogVisible"
					width="50%"
					:close-on-click-modal="false"
				>
					<div class="dialog-content">
						<el-form
							ref="currentPropertyFrom"
							:model="currentProperty"
							label-width="150px"
							:rules="rules"
							label-position="left"
						>
							<el-form-item
								label="物业名称"
								prop="company_name"
							>
								<el-select
									v-model="currentProperty.company_name"
									value-key="org_name"
									class="detail-address-select flex-1"
									remote
									filterable
									placeholder="请输入关键词"
									:remote-method="queryExistOrg"
									:loading="selectLoading"
									@change="selectOrgForProperty"
								>
									<el-option
										v-for="(item,index) in orgList"
										:key="index"
										:label="item.org_name"
										:value="item"
									/>
								</el-select>
								<div>
									如无机构可直接<a
										class="create-property"
										@click="createOrg"
									>
										新增物业
									</a>
								</div>
							</el-form-item>
							<el-form-item
								label="物业电话"
								prop="phone"
							>
								<el-input
									v-model="currentProperty.phone"
									maxlength="11"
								/>
							</el-form-item>
						</el-form>
						<el-dialog
							v-loading="dialogLoading"
							width="50%"
							:visible.sync="createOrgDialog"
							append-to-body
							title="新增机构"
							:close-on-click-modal="false"
						>
							<el-form
								ref="orgForm"
								:model="orgForm"
								:rules="orgRules"
								label-width="150px"
								label-position="left"
							>
								<el-form-item
									label="机构名称"
									prop="name"
								>
									<el-select
										v-model="orgForm.name"
										class="detail-address-select flex-1"
										remote
										filterable
										placeholder="请输入关键词"
										:remote-method="querySearchOrg"
										:loading="selectLoading"
										value-key="name"
										@change="selectOrg"
									>
										<el-option
											v-for="(item,index) in outOrgList"
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
										disabled=""
										maxlength="20"
									/>
								</el-form-item>
							</el-form>
							<div
								slot="footer"
								class="dialog-footer"
							>
								<el-button
									type="danger"
									@click="createOrgDialog = false"
								>
									取 消
								</el-button>
								<el-button
									type="primary"
									@click="saveOrg"
								>
									保存
								</el-button>
							</div>
						</el-dialog>
					</div>
					<span
						slot="footer"
						class="dialog-footer"
					>
						<el-button @click="dialogVisible=false">
							取 消
						</el-button>
						<el-button
							type="primary"
							@click="save"
						>
							确 定
						</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
		<!-- 物业操作记录弹窗 -->
		<el-dialog
			v-loading="loading"
			:visible.sync="recordVisible"
			width="50%"
		>
			<recordComponent
				:id="recordId"
				ref="recordComponent"
				:type="7"
			/>
			<span
				slot="footer"
				class="dialog-footer"
			>
				<el-button @click="recordVisible=false">
					关闭
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import pageTitle from "@/view/common/page_title.vue";
import recordComponent from "@/components/operation_record.vue";
import {
	getPropertyList,
	createProperty,
	updateProperty
} from "@/api/propertyApi.js";

import {
	getTyOrgDetail,
	getTyOrgList,
	getOrgList,
	ownOrgAdd
} from "@/api/api.js";

export default {
	components: {
		pageTitle,
		recordComponent
	},
	data() {
		var checkPhone = (rule, value, callback) => {
			let _reg = /^1[3-9]\d{9}$/;

			if (value && !_reg.test(value)) {
				return callback(new Error("请输入正确的物业电话"));
			} else {
				callback();
			}
		};

		return {
			isAdmin: false,
			createOrgDialog: false,
			keyword: "",
			loading: false,
			dialogVisible: false,
			total: 0,
			pageSize: 10,
			currentPage: 1,
			list: [],
			currentIndex: -1,
			currentProperty: {
				company_name: "",
				phone: ""
			},
			rules: {
				company_name: [
					{required: true, message: "请输入物业名称", trigger: "blur"},
				],
				phone: [
					// {required: true, message: "请输入物业电话", trigger: "blur"},
					{validator: checkPhone, trigger: "blur"}
				]
			},
			recordVisible: false,
			recordId: -1,
			orgForm: {
				name: "",
				creditCode: "",
			},
			orgRules: {
				name: [
					{required: true, message: "请选择企业名称", trigger: "blur"},
				],
				creditCode: [
					{required: true, message: "请输入信用代码/身份证号", trigger: "blur"},
				],
			},
			orgList: [],
			outOrgList: [],
			selectLoading: false,
			dialogLoading: false
		};
	},
	mounted() {
		this._getPropertyList();
	},
	methods: {
		// 获取物业列表
		_getPropertyList() {
			this.loading = true;
			let _data = {
				page_no: this.currentPage
			};

			this.keyword && (_data.keyword = this.keyword.trim());
			getPropertyList(_data).then(res => {
				this.list = res.data.list;
				this.total = res.data.total;
				this.isAdmin = res.data.is_administrator;
				this.loading = false;
			});
		},
		handleCurrentChange() {
			this._getPropertyList();
		},
		edit(index) {
			this.dialogVisible = true;
			this.currentIndex = index;
			this.currentProperty.id = this.list[this.currentIndex].id;
			this.currentProperty.company_name = this.list[this.currentIndex].company_name;
			this.currentProperty.phone = this.list[this.currentIndex].phone;
			this.currentProperty.company_id = this.list[this.currentIndex].company_id;

			this.clearValidate("currentPropertyFrom");
		},
		save() {
			this.$refs["currentPropertyFrom"].validate((valid) => {
				if (valid) {
					this.loading = true;
					let _data = {
						company_name: this.currentProperty.company_name,
						phone: this.currentProperty.phone,
						company_id: this.currentProperty.company_id
					};

					if (this.currentProperty.id) {
						_data.id = this.currentProperty.id;
						updateProperty(_data).then(() => {
							this.$message.success("操作成功");
							this._getPropertyList();
							this.dialogVisible = false;
							this.loading = false;
						}).catch((res) => {
							this.$message.error(res.message ? res.message : "操作失败");
							this.loading = false;
						});
					} else {
						createProperty(_data).then(() => {
							this.$message.success("操作成功");
							this._getPropertyList();
							this.dialogVisible = false;
							this.loading = false;
						}).catch((res) => {
							this.$message.error(res.message ? res.message : "操作失败");
							this.loading = false;
						});
					}
				}
			});
		},
		// 新增
		add() {
			this.dialogVisible = true;
			this.currentProperty = {
				company_name: "",
				phone: ""
			};
			this.currentIndex = -1;
			this.clearValidate("currentPropertyFrom");
		},

		// clearValidate
		clearValidate(form) {
			setTimeout(() => {
				this.$refs[form] && this.$refs[form].clearValidate();
			});
		},

		// 搜索
		search() {
			this.currentPage = 1;
			this._getPropertyList();
		},

		// 查看操作记录
		viewOpt(item) {
			this.recordVisible = true;
			this.recordId = item.id;
			this.$nextTick(() => {
				this.$refs.recordComponent && this.$refs.recordComponent.getRecordDetail().then(() => {
					// this.recordVisible = true;
				}).catch(() => {
					this.$message.error("获取操作记录失败");
				});
			});
		},

		// 显示新增企业
		createOrg() {
			this.createOrgDialog = true;
			this.orgForm = {
				name: "",
				creditCode: "",
			};
		},

		// 搜索天眼查企业
		querySearchOrg(query) {
			this.selectLoading = true;
			if (query && query.length >= 5) {
				let params = {
					org_name: query
				};

				getTyOrgList(params).then(res => {
					this.outOrgList = res.data;
					this.selectLoading = false;
				}).catch(err => {
					this.$message.error(err.message || "未搜索到对应公司，请更换关键词搜索!");
					this.selectLoading = false;
				});
			} else {
				this.selectLoading = false;
				this.$message.error("请输入至少5个字关键词搜索!");
			}
		},
		// 选择天眼查企业后处理数据
		selectOrg(item) {
			this.dialogLoading = true;
			getTyOrgDetail({org_name: item.name}).then(res => {
				this.orgForm = res.data;
				this.dialogLoading = false;
			}).catch(err => {
				this.dialogLoading = false;
				this.$message.warning(err.message || "操作失败，请稍后重试!");
			});
		},

		// 搜索已存在的机构
		queryExistOrg(query) {
			if (!query || query.trim().length == 0) {
				return;
			}
			this.selectLoading = true;
			let params = {
				org_name: query,
			};

			getOrgList(params).then(res => {
				this.orgList = res.data;
				this.selectLoading = false;
			}).catch(err => {
				this.$message.error(err.message || "未搜索到对应公司，请更换关键词搜索!");
				this.selectLoading = false;
			});
		},

		// selectOrgForProperty 选择已存在的公司作为物业公司
		selectOrgForProperty(e) {
			this.currentProperty.company_name = e.org_name;
			this.currentProperty.company_id = e.org_id;
		},

		// 保存天眼查机构
		saveOrg() {
			// ownOrgAdd
			this.$refs["orgForm"] && this.$refs["orgForm"].validate((valid) => {
				if (valid) {
					this.dialogLoading = true;
					ownOrgAdd(this.orgForm).then((res) => {
						this.createOrgDialog = false;
						this.dialogLoading = false;
						this.currentProperty.company_name = res.data.org_name;
						this.currentProperty.company_id = res.data.org_id;
					}).catch(res => {
						this.dialogLoading = false;
						this.$message.error(res.message ? res.message : "操作失败");
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.filter-row {
	display: flex;
	align-items: center;

	.search-input {
		width: 300px;
	}
	.search-button {
		margin-left: 20px;
	}
}
.list-container {
	margin-top: 10px;
	.list-table {
		width: 100%;
	}
}
.flex-row {
	display: flex;
	align-items: center;
}
.create-property {
	cursor: pointer;
	color: #409EFF;
}
.detail-address-select {
	width: 100%;
}
</style>

