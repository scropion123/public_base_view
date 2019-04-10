<template>
	<div class="baseinfo-container">
		<el-button
			v-if="isAdmin"
			type="primary"
			@click="createBuilding"
		>
			新增楼栋
		</el-button>
		<el-tabs
			v-model="activeTab"
			@tab-click="handelClick"
		>
			<el-tab-pane
				v-for="(item, index) in officeBuildings"
				:key="index"
				:label="'楼栋'+(index+1)"
				:name="String(index)"
			>
				<el-tabs>
					<el-tab-pane label="楼栋基本信息1">
						<buildingComponent1
							:is-create="item.isCreate"
							:area-options="areaOptions"
							:index="index"
							:levels="levels"
							:industrys-list="industrysList"
							:property-types="propertyTypes"
							:property-owner-list="propertyOwnerList"
							@updateOfficeBuilding="getOfficeBuilding"
						/>
					</el-tab-pane>
					<el-tab-pane
						v-if="item.id"
						label="楼栋基本信息2"
					>
						<buildingComponent2
							:index="index"
							:is-create="item.isCreate"
							:building-type-list="buildingTypeList"
							:facade-type-list="facadeTypeList"
							:price-unit-list="priceUnitList"
							@updateOfficeBuilding="getOfficeBuilding"
						/>
					</el-tab-pane>
					<el-tab-pane
						v-if="item.id"
						label="政策相关信息"
						name="poplicy"
					>
						<policyComponent
							:is-create="item.isCreate"
							:index="index"
							@updateOfficeBuilding="getOfficeBuilding"
						/>
					</el-tab-pane>
					<el-tab-pane
						v-if="item.id"
						label="电梯相关信息"
						name="elevator"
					>
						<elevatorComponent
							:is-create="item.isCreate"
							:index="index"
							:good-size-list="goodSizeList"
							@updateOfficeBuilding="getOfficeBuilding"
						/>
					</el-tab-pane>
					<el-tab-pane
						v-if="item.id"
						label="空调与车位信息"
						name="airConditioner"
					>
						<buildingOtherInfo
							:is-create="item.isCreate"
							:index="index"
							:ac-type-list="acTypeList"
							:ac-time-list="acTimeList"
							@updateOfficeBuilding="getOfficeBuilding"
						/>
					</el-tab-pane>
				</el-tabs>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import moment from "moment";
import buildingComponent1 from "./building_component_1.vue";
import buildingComponent2 from "./building_component_2.vue";
import policyComponent from "./policy_component.vue";
import elevatorComponent from "./elevator_component.vue";
import buildingOtherInfo from "./building_other_info_component.vue";
import {
	getDicAreaCode
} from "@/api/api.js";
import {
	getBuildingList,
	getPropertyTypes,
	getBuildingLevelList,
	getPropertyOwnerList,
	getIndustrysList,
	getBuildingTypeList,
	getFacadeTypeList,
	getGoodSizeList,
	getACTypeList,
	getACTimeList,
	getPriceUnitList
} from "@/api/officeApi.js";
let _defaultBuilding = {
	// 楼栋名称
	building_name: "",
	// 是否分单元
	divide_unit: "1",
	// 单元数
	unit_num: "",
	num_of_floor_levels: "",
	// 楼宇建筑总面积
	total_area: "",
	// 办公建筑总面积
	work_total_area: "",
	// 标准层建筑面积
	typical_floor_area: "",
	// 标准层高
	typical_floor_height: "",
	// 物业公司
	propertyName: "",
	// 物业费
	property_charge: "",
	// 预计入市时间
	in_the_market_time: "",
	// 入市时间具体到日
	in_market_time_to_date: "1",
	// 得房率
	construction_rate: "",
	// 新风系统
	is_nather: "",
	// 暖气系统
	is_heater: "",
	// 其他产业聚焦
	industry_other: "",
	// 选择的所在地区
	selectedArea: [],
	// industrys 产业聚焦
	industrys_ids: [],
	// 产权归属
	property_ownership: "",
	// 物业类型
	tenement_type: "",
	// 写字楼等级
	building_level: "",
	// 物业公司名称
	property_com_name: "",
	// 单元信息
	unit_list: [],
	// 新单元信息
	new_unit_list: [],
	// 本栋租金范围
	building_price: [{
		start_price: "",
		end_price: "",
		time: moment(new Date()).format("yyyy-MM-dd"),
		price_unit: ""
	}]
};

import _ from "lodash";

export default {
	components: {
		buildingComponent1,
		buildingComponent2,
		policyComponent,
		elevatorComponent,
		buildingOtherInfo
	},
	data() {
		return {
			activeTab: "0",
			buildings: [],
			areaOptions: [],
			levels: [],
			industrysList: [],
			propertyTypes: [],
			propertyOwnerList: [],
			buildingTypeList: [],
			facadeTypeList: [],
			goodSizeList: [],
			acTypeList: [],
			acTimeList: [],
			isAdmin: false,
			priceUnitList: []
		};
	},
	computed: {
		officeBuildings() {
			return this.$store.getters.officeBuilding;
		},
		officeProject() {
			return this.$store.getters.officeProject;
		}
	},
	mounted() {
		this._getArea();
		this.getOfficeBuilding();
		// 写字楼等级
		this._getBuildingLevelList();
		// 产权归属
		this._getPropertyOwnerList();
		// 获取物业类型
		this._getPropertyTypes();
		// 获取产业聚焦数据
		this._getIndustrysList();
		// 获取建筑类型数据
		this._getBuildingTypeList();
		// 获取外立面数据
		this._getFacadeTypeList();
		// 获取货梯尺寸
		this._getGoodSizeList();
		// 中央空调类型
		this._getACTypeList();
		// 中央空调供应时间接口
		this._getACTimeList();
		// 获取本栋租金范围
		this._getPriceUnitList();
	},
	methods: {
		_getIndustrysList() {
			getIndustrysList().then(res => {
				this.industrysList = res.data;
			});
		},
		// 获取物业类型
		_getPropertyTypes() {
			getPropertyTypes().then(res => {
				this.propertyTypes = res.data;
			});
		},
		// 获取产权归属接口
		_getPropertyOwnerList() {
			getPropertyOwnerList().then(res => {
				this.propertyOwnerList = res.data;
			});
		},
		// 获取写字楼等级
		_getBuildingLevelList() {
			getBuildingLevelList().then(res => {
				this.levels = res.data;
			});
		},
		// 建筑类型获取
		_getBuildingTypeList() {
			getBuildingTypeList().then(res => {
				this.buildingTypeList = res.data;
			});
		},
		// 外立面类型获取
		_getFacadeTypeList() {
			getFacadeTypeList().then(res => {
				this.facadeTypeList = res.data;
			});
		},
		// getGoodSizeList 获取货梯尺寸接口
		_getGoodSizeList() {
			getGoodSizeList().then(res => {
				this.goodSizeList = res.data;
			});
		},
		// 获取中央空调类型
		_getACTypeList() {
			getACTypeList().then(res => {
				this.acTypeList = res.data;
			});
		},
		// 中央空调供应时间接口
		_getACTimeList() {
			getACTimeList().then(res => {
				this.acTimeList = res.data;
			});
		},
		handelClick() {

		},
		// 获取区域联动筛选数据
		_getArea() {
			getDicAreaCode().then((res) => {
				this.areaOptions = res.data;
			});
		},
		// 新增楼栋
		createBuilding() {
			let _obj = _.clone(_defaultBuilding);

			if (this.officeProject && this.officeProject.id) {
				this.officeProject.province_code && (_obj.selectedArea[0] = this.officeProject.province_code);
				this.officeProject.city_code && (_obj.selectedArea[1] = this.officeProject.city_code);
				this.officeProject.district_code && (_obj.selectedArea[2] = this.officeProject.district_code);
				// 详细地址
				this.officeProject.address && (_obj.detail_address = this.officeProject.address);
				// 经纬度 longitude latitude
				this.officeProject.longitude && (_obj.longitude = this.officeProject.longitude);
				this.officeProject.latitude && (_obj.latitude = this.officeProject.latitude);
			}
			_obj.isCreate = true;
			this.buildings.push(_obj);

			this.activeTab = String(this.buildings.length - 1);
			this.$store.commit("setOfficeBuilding", this.buildings);
		},
		// 获取getOfficeBuilding
		getOfficeBuilding() {
			let _data = {
				project_id: this.$route.params.id
			};

			getBuildingList(_data).then(res => {
				let _list = res.data.list;


				_list.forEach(item => {
					// 获取预计入市时间具体到日或者具体到月
					if (item.in_the_market_time && item.in_the_market_time.split("-").length == 3) {
						item.in_market_time_to_date = "1";
					} else if (item.in_the_market_time && item.in_the_market_time.split("-").length == 2) {
						item.in_market_time_to_date = "2";
					} else {
						item.in_market_time_to_date = "";
					}
					// 获取省市区初始值
					item.selectedArea = [];
					item.province_code && (item.selectedArea[0] = item.province_code);
					item.city_code && (item.selectedArea[1] = item.city_code);
					item.district_code && (item.selectedArea[2] = item.district_code);

					// 政策tab
					if (!item.policy_content) {
						item.policy_content = [];
					}
					item.new_unit_list = [];
				});

				this.buildings = _list;

				this.isAdmin = res.data.is_administrator;

				this.$store.commit("setOfficeBuilding", _list);
			});
		},
		// 获取价格单位接口哦
		_getPriceUnitList() {
			getPriceUnitList().then((res) => {
				res.data.forEach(item => {
					item.disabled = false;
				});
				this.priceUnitList = res.data;
			});
		},
	}
};
</script>
<style lang="less" scoped>
@import url(./common.less);
</style>