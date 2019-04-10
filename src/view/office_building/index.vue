<template>
	<div
		v-loading="loading"
		class="wrapper"
	>
		<page-title :title="title" />
		<el-tabs
			v-model="activeTab"
			@tab-click="handleClick"
		>
			<el-tab-pane
				label="基本信息1"
				name="baseInfoFirst"
			>
				<baseInfoFirst
					ref="baseInfoComponent"
					@updateBuilding="getBusinessProjectDetail"
				/>
			</el-tab-pane>
			<el-tab-pane
				v-if="$route.params && $route.params.id"
				label="基本信息2"
				name="baseInfoSecond"
			>
				<baseInfoSecond @updateBuilding="getBusinessProjectDetail" />
			</el-tab-pane>
			<el-tab-pane
				v-if="$route.params && $route.params.id"
				label="开发商信息"
				name="developer"
			>
				<developerComponent @updateBuilding="getBusinessProjectDetail" />
			</el-tab-pane>
			<el-tab-pane
				v-if="$route.params && $route.params.id"
				label="楼栋信息"
				name="building"
			>
				<buildingComponent />
			</el-tab-pane>
			<el-tab-pane
				v-if="$route.params && $route.params.id"
				label="操作记录"
				name="optRecord"
			>
				<optRecordComponent ref="optRecord" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import pageTitle from "@/view/common/page_title.vue";
import baseInfoFirst from "./baseinfo_first.vue";
import baseInfoSecond from "./baseinfo_second.vue";
import buildingComponent from "./building_component.vue";
import developerComponent from "./developer_component.vue";
import optRecordComponent from "./opt_record_component.vue";

import {
	getBuildingProjectDetail
} from "@/api/officeApi.js";


export default {
	components: {
		pageTitle,
		baseInfoFirst,
		baseInfoSecond,
		buildingComponent,
		developerComponent,
		optRecordComponent
	},
	data() {
		return {
			activeTab: "baseInfoFirst",
			isAdd: false,
			isDetail: false,
			isEdit: false,
			officeProject: {
				is_single: "1",
				building_num: "1",
				work_total_area: "",
				business_price: [{
					start_price: "",
					end_price: ""
				}],
				investment_tel: "",
				address: "",
				investmentTelList: [""],
				business_area: [],
				property_list: [],
				selectedArea: [],
				developer_list: [
					{
						user_name: "",
						user_tel: ""
					}
				],
				// 写字楼入市具体到日还是月
				entry_time_date: "1",
				entry_time: "",
				property_list_ids: [],
				// 商圈ids
				business_area_ids: [],
				// 项目图片
				image_url_list: []
			},
			loading: false,
			title: "新增写字楼"
		};
	},
	watch: {
		"$route"(to, from) {
			if (from && to && from.name == "add_office_building" && to.name == "edit_office_building") {
				this.getBusinessProjectDetail();
			}
		}
	},
	created() {
		if (this.$route.name == "add_office_building") {
			this.isAdd = true;
			this.isDetail = false;
			this.isEdit = false;
			this.title = "新增写字楼";
		} else if (this.$route.name == "edit_office_building") {
			this.isAdd = false;
			this.isDetail = false;
			this.isEdit = true;
			this.title = "编辑写字楼";
		} else if (this.$route.name == "office_building_detail") {
			this.isAdd = false;
			this.isDetail = true;
			this.isEdit = false;
			this.title = "写字楼详情";
		}
	},
	async mounted() {
		if (this.isDetail || this.isEdit) {
			await this.getBusinessProjectDetail();
		} else {
			this.$store.commit("setOfficeProject", this.officeProject);
		}
	},
	methods: {
		handleClick() {
			if (this.activeTab == "optRecord") {
				this.$refs["optRecord"] && this.$refs["optRecord"].getRecordList();
			}
		},
		async getBusinessProjectDetail() {
			if (!(this.$route.params && this.$route.params.id)) {
				return;
			}
			this.loading = true;
			let _data = {
				id: this.$route.params.id
			};

			await getBuildingProjectDetail(_data).then((res) => {
				this.officeProject = res.data;
				// 招 商电话数组 investmentTelList
				if (this.officeProject.investment_tel) {
					this.officeProject.investmentTelList = this.officeProject.investment_tel.split(",");
				} else {
					this.officeProject.investmentTelList = [""];
				}
				this.officeProject.business_area_ids = this._getSelectedBusinessArea();
				this.officeProject.property_list_ids = this._getSelectedPropertyList();
				this.officeProject.selectedArea = this._getSelectedArea();
				// 判读写字楼入市具体到日还是月
				if (this.officeProject.entry_time) {
					if (this.officeProject.entry_time.split("-").length == 3) {
						this.officeProject.entry_time_date = "1";
					} else {
						this.officeProject.entry_time_date = "2";
					}
				} else {
					this.officeProject.entry_time_date = "2";
				}
				if (!this.officeProject.developer_list || this.officeProject.developer_list.length == 0) {
					this.officeProject.developer_list = [{
						user_name: "",
						user_tel: ""
					}];
				}
				// 处理项目图片
				let _image_url_list = [];

				if (this.officeProject.image_urls && this.officeProject.image_urls.length > 0) {
					this.officeProject.image_urls.forEach(item => {
						_image_url_list.push({
							url: item.url,
							name: item.url,
							response: {
								data: {
									url: item.url,
									route: item.route
								}
							}
						});
					});
				}
				this.officeProject.image_url_list = _image_url_list;
				console.log(_image_url_list);
				this.$store.commit("setOfficeProject", this.officeProject);
				this.$refs["baseInfoComponent"] && this.$refs["baseInfoComponent"]._getSimpleList();
				this.loading = false;
			});
		},
		// 获取选择的商圈
		_getSelectedBusinessArea() {
			let _arr = [];

			if (this.officeProject.business_area && this.officeProject.business_area.length > 0) {
				this.officeProject.business_area.forEach(item => {
					_arr.push(item.business_area_id);
				});
			}
			return _arr;
		},
		// 获取选中的propertyList
		_getSelectedPropertyList() {
			let _arr = [];

			if (this.officeProject.property_list && this.officeProject.property_list.length > 0) {
				this.officeProject.property_list.forEach(item => {
					_arr.push(item.type_id);
				});
			}
			return _arr;
		},

		// 获取选中的地区
		// 所在地区
		_getSelectedArea() {
			let _arr = [];

			this.officeProject.province_code && (_arr[0] = this.officeProject.province_code);
			this.officeProject.city_code && (_arr[1] = this.officeProject.city_code);
			this.officeProject.district_code && (_arr[2] = this.officeProject.district_code);

			return _arr;
		}
	}
};
</script>
<style lang="less" scoped>

</style>
