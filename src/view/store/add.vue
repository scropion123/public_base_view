<template>
	<div class="wrapper">
		<page-title :title="(storeId==0?&quot;新增&quot;:&quot;编辑&quot;)+&quot;门店&quot;" />
		<div class="content">
			<el-form
				ref="addForm"
				:model="addForm"
				:rules="rules"
				label-width="150px"
			>
				<el-form-item
					label="所属运营商"
					prop="operator_name"
				>
					<el-select
						v-model="addForm.operator_name"
						filterable
						remote
						placeholder="请输入品牌名/公司名称关键字搜索"
						:remote-method="querySearchAsync"
						value-key="list_name"
						:loading="loading"
						:disabled="storeId>0"
						@change="handleSelect"
					>
						<el-option
							v-for="(item,index) in comOptionArr"
							:key="index"
							:label="item.list_name"
							:value="item"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="门店对应公司"
					prop="company_id"
				>
					<el-select
						v-model="addForm.company_id"
						placeholder="请选择"
						clearable
						@change="changeCom"
						@clear="clearCom"
					>
						<el-option
							v-for="(item, index) in comOptions"
							:key="index"
							:label="item.company_name"
							:value="item.company_id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="门店名称"
					prop="store_name"
				>
					<el-input
						v-model="addForm.store_name"
						placeholder="请输入门店名称,20字以内"
						maxlength="20"
					/>
				</el-form-item>
				<el-form-item
					label="门店建筑面积(㎡)"
					prop="area"
				>
					<!-- <el-input type="area" v-model.number="addForm.area" placeholder="请输入5位以内数字" maxlength="5" autocomplete="off"></el-input> -->
					<numberInput
						:is-decimal="true"
						:intlength="5"
						:decimallength="2"
						:value="String(addForm.area)"
						@update:value="addForm.area=$event"
					/>
				</el-form-item>
				<el-form-item
					label="合作模式"
					prop="cooperat_mode"
				>
					<el-select
						v-model="addForm.cooperat_mode"
						placeholder="请选择"
						clearable
					>
						<el-option
							label="租赁"
							value="1"
						/>
						<el-option
							label="品牌输出"
							value="2"
						/>
						<el-option
							label="联合运营"
							value="3"
						/>
						<el-option
							label="其它"
							value="4"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="开业时间"
					prop="open_time"
				>
					<el-radio-group
						v-model="open_time_type"
						@change="changeTime(1)"
					>
						<el-radio label="1">
							精准到月
						</el-radio>
						<el-radio label="2">
							精准到日
						</el-radio>
					</el-radio-group>
					<div>
						<el-date-picker
							v-model="addForm.open_time"
							:type="open_time_type==1?'month':'date'"
							placeholder="请选择日期"
						/>
					</div>
				</el-form-item>
				<el-form-item
					label="到期时间"
					prop="expire_time"
				>
					<el-radio-group
						v-model="expire_time_type"
						@change="changeTime(2)"
					>
						<el-radio label="1">
							精准到月
						</el-radio>
						<el-radio label="2">
							精准到日
						</el-radio>
					</el-radio-group>
					<div>
						<el-date-picker
							v-model="addForm.expire_time"
							:type="expire_time_type==1?'month':'date'"
							placeholder="请选择日期"
						/>
					</div>
				</el-form-item>
				<el-form-item
					label="门店地址"
					prop="comAddressSelected"
				>
					<el-cascader
						v-model="addForm.comAddressSelected"
						placeholder="请选择门店地址"
						clearable
						:options="provinceCityAreaList"
					/>
				</el-form-item>
				<el-form-item
					label="详细地址"
					prop="address"
				>
					<el-input
						v-model="addForm.address"
						placeholder="请输入详细地址，30字以内"
						maxlength="30"
					/>
				</el-form-item>
				<el-form-item label="关联写字楼楼栋">
					<div
						v-for="(data, index) in addForm.buildings"
						:key="index"
						class="m-b-xs"
					>
						<div class="flex">
							<el-select
								v-model="data.building_project_name"
								filterable
								remote
								placeholder="请输写字楼名称关键字搜索"
								:remote-method="querySearchProject"
								value-key="project_name"
								:loading="loading"
								clearable
								@focus="searchFocus(index)"
								@clear="clearProject(index)"
								@change="handleSelectProject"
							>
								<el-option
									v-for="(item,index) in projectOptions"
									:key="index"
									:label="item.project_name"
									:value="item"
								/>
							</el-select>
							<el-select
								v-model="data.building_name"
								filterable
								remote
								placeholder="请输入楼栋名称关键字搜索"
								:remote-method="querySearchBuilding"
								value-key="building_name"
								:loading="loading"
								@focus="searchFocus(index)"
								@change="handleSelectBuilding"
							>
								<el-option
									v-for="(item,index) in buildingOptions"
									:key="index"
									:label="item.building_name"
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
					@click="addStoreSubmit('addForm')"
				>
					确 定
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import numberInput from "@/components/input_component.vue";
import storage from "@/util/storage";
import {
	formatDate
} from "@/util/util";
import {
	getDicAreaCode, getOperatorList, getOperatorCom, storeAddSubmit, storeDetail, storeEditSubmit, searchBuildingList, searchProjectList,
} from "@/api/api";
export default {
	components: {
		pageTitle,
		numberInput
	},
	data() {
		return {
			storeId: this.$route.params.id,
			comOptions: [],
			provinceCityAreaList: [],
			open_time_type: "1",
			expire_time_type: "1",
			loading: false,
			comOptionArr: [],
			projectOptions: [],
			buildingOptions: [],
			projectIndex: "",
			addForm: {
				operator_name: "",
				company_name: "",
				company_id: "",
				store_name: "",
				area: "",
				cooperat_mode: "",
				open_time: "",
				expire_time: "",
				comAddressSelected: [],
				address: "",
				buildings: [{
					building_project_id: "",
					building_id: "",
				}],
			},
			rules: {
				operator_name: [
					{required: true, message: "请输入运营商名称", trigger: "blur"},
				],
				// company_id: [
				// 	{required: true, message: "请选择门店对应公司", trigger: "change"},
				// ],
				store_name: [
					{required: true, message: "请输入门店名称", trigger: "blur"},
				],
				area: [
					{required: true, message: "请输入门店建筑面积", trigger: "blur"},
				],
				open_time: [
					{required: true, message: "请选择开业时间", trigger: "blur"},
				],
				comAddressSelected: [
					{required: true, message: "请选择门店地址", trigger: "change"}
				],
				address: [
					{required: true, message: "请输入门店详细地址", trigger: "blur"},
				],
			}
		};
	},
	created() {
		// 从运营商列表进入时带入所属运营商
		let msg = storage.getItem("operator-data");

		if (msg) {
			this.addForm.operator_name = msg.operator_name;
			this.addForm.operator_id = msg.operator_id;
			this.getOptSubsidiary();
			storage.removeItem("operator-data");
		}
		this.getProvinceCityDistrict();
		if (this.storeId > 0) {
			this.getStoreDetail();
		}
	},
	methods: {
		// 写字楼楼栋搜索框获取焦点
		searchFocus(index) {
			this.projectIndex = index;
		},
		// 增加关联写字楼
		addCom() {
			this.addForm.buildings.push({
				company_id: "",
				company_name: "",
			});
		},
		// 删除关联写字楼
		delCom(index) {
			this.addForm.buildings.splice(index, 1);
		},
		// 清除某项写字楼信息
		clearProject(index) {
			this.addForm.buildings[index].building_project_id = "";
			this.addForm.buildings[index].building_project_name = "";
			this.addForm.buildings[index].building_id = "";
			this.addForm.buildings[index].building_name = "";
		},
		// 输入关键字选择写字楼
		querySearchProject(queryString) {
			if (queryString) {
				let params = {
					keyword: queryString,
					page_size: 100
				};

				this.loading = true;
				searchProjectList(params).then(res => {
					this.loading = false;
					this.projectOptions = res.data;
				}).catch(err => {
					this.loading = false;
					this.projectOptions = err.data;
					this.$message.warning(err.message || "未搜索到写字楼信息，请更换关键词搜索!");
				});
			}
		},
		// 选择后处理数据
		handleSelectProject(item) {
			if (item) {
				this.addForm.buildings[this.projectIndex].building_project_id = item.id;
				this.addForm.buildings[this.projectIndex].building_id = "";
				let params = {
					project_id: item.id,
					page_size: 100
				};

				this.loading = true;
				searchBuildingList(params).then(res => {
					this.loading = false;
					this.buildingOptions = res.data;
				}).catch(err => {
					this.loading = false;
				});
			}
			// this.addForm.buildings[this.projectIndex].building_name = "";
		},
		// 输入关键字选择写字楼楼栋
		querySearchBuilding(queryString) {
			if (queryString) {
				let params = {
					project_id: this.addForm.buildings[this.projectIndex].building_project_id,
					keyword: queryString,
					page_size: 100
				};

				this.loading = true;
				searchBuildingList(params).then(res => {
					this.loading = false;
					this.buildingOptions = res.data;
				}).catch(err => {
					this.loading = false;
					this.buildingOptions = err.data;
					this.$message.warning(err.message || "未搜索到写字楼信息，请更换关键词搜索!");
				});
			}
		},
		// 选择后处理数据
		handleSelectBuilding(item) {
			this.addForm.buildings[this.projectIndex].building_id = item.id;
			this.addForm.buildings[this.projectIndex].building_name = item.building_name;
		},
		// 切换时间
		changeTime(type) {
			if (type == 1) {
				this.addForm.open_time = "";
			} else {
				this.addForm.expire_time = "";
			}
		},
		// 获取详情
		getStoreDetail() {
			storeDetail({id: this.storeId}).then(res => {
				this.addForm = res.data;
				this.addForm.comAddressSelected = [res.data.province_code, res.data.city_code, res.data.district_code];
				this.open_time_type = this.addForm.open_time.length > 7 ? "2" : "1";
				this.expire_time_type = this.addForm.expire_time.length > 7 ? "2" : "1";
				this.addForm.cooperat_mode = this.addForm.cooperat_mode == 0 ? "" : this.addForm.cooperat_mode;
				if (!this.addForm.buildings || this.addForm.buildings.length == 0) {
					this.addForm.buildings = [{
						building_project_id: "",
						building_id: "",
					}];
				}
				this.getOptSubsidiary();
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
		getProvinceCityDistrict() {
			getDicAreaCode({}).then(res => {
				this.provinceCityAreaList = res.data;
			});
		},
		// 输入关键字选择运营商
		querySearchAsync(queryString) {
			if (queryString) {
				let params = {
					keyword: queryString,
					page_size: 100
				};

				this.loading = true;
				getOperatorList(params).then(res => {
					this.loading = false;
					if (res.data.list && res.data.list.length > 0) {
						for (let item of res.data.list) {
							item.list_name = "【" + item.operator_name + "】【" + item.company_name + "】";
						}
					}
					this.comOptionArr = res.data.list;
				}).catch(err => {
					this.$message.warning(err.message || "未搜索到运营商信息，请更换关键词搜索!");
				});
			}
		},
		// 选择后处理数据
		handleSelect(item) {
			this.addForm.operator_id = item.id;
			this.addForm.operator_name = item.operator_name;
			this.addForm.company_id = item.company_id;
			this.addForm.company_name = item.company_name;
			this.getOptSubsidiary();
		},
		// 获取运营商对应子公司
		getOptSubsidiary() {
			let params = {
				id: this.addForm.operator_id,
			};

			// 获取对应子公司
			getOperatorCom(params).then(res => {
				this.comOptions = res.data;
			}).catch(err => {
				this.$message.warning(err.message || "未搜索到子公司信息，请更换关键词搜索!");
			});
		},
		changeCom() {
			this.$forceUpdate();
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		addStoreSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.addForm.comAddressSelected && this.addForm.comAddressSelected.length == 0) {
						this.$message({
							message: "请选择门店地址！",
							type: "warning"
						});
						return;
					}
					let buildingsArr = [];

					if (this.addForm.buildings.length > 0) {
						for (let i = 0; i < this.addForm.buildings.length; i++) {
							if (!this.addForm.buildings[i].building_project_id && this.addForm.buildings[i].building_id) {
								this.$message({
									message: "关联写字楼楼栋第" + (i + 1) + "项请选择写字楼！",
									type: "warning"
								});
								return;
							} else if (this.addForm.buildings[i].building_project_id && !this.addForm.buildings[i].building_id) {
								this.$message({
									message: "关联写字楼楼栋第" + (i + 1) + "项请选择楼栋！",
									type: "warning"
								});
								return;
							}
							if (this.addForm.buildings[i].building_id && this.addForm.buildings[i].building_project_id) {
								buildingsArr.push({
									building_id: this.addForm.buildings[i].building_id,
									building_project_id: this.addForm.buildings[i].building_project_id,
								});
							}
						}
					}
					let params = {
						province_code: this.addForm.comAddressSelected[0],
						city_code: this.addForm.comAddressSelected[1],
						district_code: this.addForm.comAddressSelected[2],
						operator_id: this.addForm.operator_id,
						operator_name: this.addForm.operator_name,
						company_id: this.addForm.company_id,
						company_name: this.addForm.company_name,
						store_name: this.addForm.store_name,
						open_time: this.addForm.open_time,
						expire_time: this.addForm.expire_time,
						address: this.addForm.address,
						cooperat_mode: this.addForm.cooperat_mode,
						area: this.addForm.area,
						buildings: buildingsArr,
					};

					for (let item of this.comOptions) {
						if (item.company_id === params.company_id) {
							params.company_name = item.company_name;
						}
					}
					let dateReg = /\d{4}-\d{2}(-\d{2})?/;

					if (params.open_time && !dateReg.test(params.open_time)) {
						params.open_time = formatDate(params.open_time, this.open_time_type == 1 ? "yyyy-MM" : "yyyy-MM-dd");
					}
					if (params.expire_time && !dateReg.test(params.expire_time)) {
						params.expire_time = formatDate(params.expire_time, this.expire_time_type == 1 ? "yyyy-MM" : "yyyy-MM-dd");
					}
					if (params.expire_time === null) {
						params.expire_time = "";
					}
					if (this.storeId == 0) {
						storeAddSubmit(params).then(res => {
							this.$message({
								message: res.message,
								type: "success"
							});
							this.$router.push("/opt/store/detail/" + res.data[0]);
						}).catch(err => {
							this.$message({
								message: err.message,
								type: "error"
							});
						});
					} else {
						params.id = this.storeId;
						storeEditSubmit(params).then(res => {
							this.$message({
								message: res.message,
								type: "success"
							});
							this.$router.push("/opt/store/detail/" + this.storeId);
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
		clearCom() {
			this.addForm.company_name = "";
		},
		goBack() {
			this.$router.push("/opt/store/list");
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