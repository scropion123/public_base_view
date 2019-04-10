<template>
	<div v-loading="loading">
		<el-form
			id="1"
			ref="officeBuildingForm"
			label-width="150px"
			label-position="left"
			:model="officeBuilding"
			:rules="formRule"
		>
			<div class="flex-row">
				<!-- 楼栋名称 -->
				<el-form-item
					class="flex-1"
					label="楼栋名称"
					prop="building_name"
				>
					<el-input
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.building_name"
						maxlength="20"
						placeholder="请输入楼栋名称, 20字以内"
					/>
					<span v-else>
						{{ officeBuilding.building_name }}
					</span>
				</el-form-item>
				<!-- 楼栋编号 -->
				<el-form-item
					class="flex-1"
					label="楼栋编号"
					prop="building_num"
				>
					<el-input
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.building_num"
						maxlength="3"
						placeholder="请输入3位楼栋编号"
						@change="checkBuildingNum"
						@blur="checkBuildingNum"
					/>
					<span v-else>
						{{ officeBuilding.building_num }}
					</span>
				</el-form-item>
			</div>
			<el-form-item
				label="所在地区"
				prop="selectedArea"
			>
				<el-cascader
					v-if="isAdd||isEdit||isCreate||isDetailEdit"
					placeholder="请选择区域"
					:options="areaOptions"
					:value="officeBuilding.selectedArea"
					change-on-select
					clearable
					class="area-select"
					@change="changeAreaSelect"
				/>
				<span v-else>
					{{ computedArea }}
				</span>
			</el-form-item>
			<el-form-item
				label="详细地址"
				prop="detail_address"
			>
				<el-select
					v-if="isAdd||isEdit||isCreate||isDetailEdit"
					v-model="officeBuilding.detail_address"
					class="detail-address-select"
					remote
					filterable
					placeholder="请输入关键词"
					:remote-method="getAddressList"
					:loading="selectLoading"
					value-key="name"
					@change="addressDetailChange"
				>
					<el-option
						v-for="(item,index) in addressOptions"
						:key="index"
						:label="item.name"
						:value="item"
					/>
				</el-select>
				<span v-else>
					{{ officeBuilding.detail_address }}
				</span>
			</el-form-item>
			<!-- 写字楼等级	 -->
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="写字楼等级"
					prop="building_level"
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.building_level"
					>
						<el-option
							v-for="item in levels"
							:key="item.id"
							:label="item.value"
							:value="item.id+''"
						/>
					</el-select>
					<span v-else>
						{{ computedBuildingLevel[officeBuilding.building_level] }}
					</span>
				</el-form-item>
				<!-- 是否分单元 -->
				<el-form-item
					class="flex-1"
					label="是否分单元"
					prop="divide_unit"
				>
					<el-radio-group
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.divide_unit"
						@change="changeDivideUnit"
					>
						<el-radio label="1">
							是
						</el-radio>
						<el-radio label="2">
							否
						</el-radio>
					</el-radio-group>
					<span v-else>
						{{ officeBuilding.divide_unit=="1"?"是":"否" }}
					</span>
				</el-form-item>
			</div>
			<!-- 单元数 -->
			<div class="flex-row">
				<!-- 分单元 -->
				<el-form-item
					v-if="officeBuilding.divide_unit==1"
					class="flex-1"
					label="单元数"
					prop="unit_num"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="2"
						:value="String(officeBuilding.unit_num)"
						@update:value="officeBuilding.unit_num=$event"
					/>
					<span v-else>
						{{ officeBuilding.unit_num }}
					</span>
				</el-form-item>
				<!-- 不分单元 -->
				<el-form-item
					v-else
					class="flex-1"
					label="单元数"
				>
					{{ officeBuilding.unit_num }}
				</el-form-item>
				<!-- 总层数 -->
				<el-form-item
					class="flex-1"
					label="总层数"
					prop="num_of_floor_levels"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="3"
						:value="String(officeBuilding.num_of_floor_levels)"
						@update:value="officeBuilding.num_of_floor_levels=$event"
					/>
					<span v-else>
						{{ officeBuilding.num_of_floor_levels }}
					</span>
				</el-form-item>
			</div>
			<!-- 单元信息 -->
			<div v-if="officeBuilding.divide_unit==1">
				<el-form-item
					v-for="(item, index) in officeBuilding.unit_list"
					:key="item.id"
					:label="'单元号' + (index + 1)"
					:prop="'unit_list.' + index + '.unit'"
					:rules="unitRule"
				>
					<div
						v-if="isAdd || isEdit || isDetailEdit"
						class="flex-row"
					>
						<unitInput
							:value="String(officeBuilding.unit_list[index].unit)"
							placeholder="大写字母和数字组合，三位，如A01"
							:maxlength="3"
							@update:value="officeBuilding.unit_list[index].unit=$event;$forceUpdate()"
						/>
					</div>
					<div v-else>
						{{ officeBuilding.unit_list[index].unit }}
					</div>
				</el-form-item>
				<el-form-item
					v-for="(item, index) in officeBuilding.new_unit_list"
					:key="index"
					:label="'单元号' + (officeBuilding.unit_list.length + index + 1)"
					:prop="'new_unit_list.' + index + '.unit'"
					:rules="unitRule"
				>
					<div class="flex-row">
						<unitInput
							:value="String(officeBuilding.new_unit_list[index].unit)"
							placeholder="大写字母和数字组合，三位，如A01"
							:maxlength="3"
							@update:value="updateNewUnitList(index,$event)"
						/>
						<el-button
							class="remove-unit-button"
							size="small"
							type="danger"
							@click="removeUnit(index)"
						>
							删除
						</el-button>
					</div>
				</el-form-item>
				<el-form-item v-if="(officeBuilding.new_unit_list.length + officeBuilding.unit_list.length) < officeBuilding.unit_num">
					<el-button
						v-if="isAdd || isEdit || isDetailEdit || isCreate"
						size="small"
						type="primary"
						@click="addUnit()"
					>
						新增单元
					</el-button>
				</el-form-item>
			</div>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="楼宇建筑总面积"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="8"
							:decimallength="2"
							:value="String(officeBuilding.total_area)"
							@update:value="officeBuilding.total_area=$event"
						/>
						<span v-else>
							{{ officeBuilding.total_area || "--" }}
						</span>
						<span class="item-unit">
							㎡
						</span>
					</div>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="办公建筑总面积"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="8"
							:decimallength="2"
							:value="String(officeBuilding.work_total_area)"
							@update:value="officeBuilding.work_total_area=$event"
						/>
						<span v-else>
							{{ officeBuilding.work_total_area || "--" }}
						</span>
						<span class="item-unit">
							㎡
						</span>
					</div>
				</el-form-item>
			</div>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="标准层建筑面积"
					prop="typical_floor_area"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="8"
							:decimallength="2"
							:value="String(officeBuilding.typical_floor_area)"
							@update:value="officeBuilding.typical_floor_area=$event"
						/>
						<span v-else>
							{{ officeBuilding.typical_floor_area || "--" }}
						</span>
						<span class="item-unit">
							㎡
						</span>
					</div>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="标准层高"
					prop="typical_floor_height"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="2"
							:decimallength="2"
							:value="String(officeBuilding.typical_floor_height)"
							@update:value="officeBuilding.typical_floor_height=$event"
						/>
						<span v-else>
							{{ officeBuilding.typical_floor_height || "--" }}
						</span>
						<span class="item-unit">
							m
						</span>
					</div>
				</el-form-item>
			</div>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="产权归属"
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.property_ownership"
					>
						<el-option
							v-for="item in propertyOwnerList"
							:key="item.id"
							:label="item.value"
							:value="item.id+''"
						/>
					</el-select>
					<span v-else>
						{{ computedPropertyOwnerShip[officeBuilding.property_ownership] || "--" }}
					</span>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="物业类型"
					prop="tenement_type"
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.tenement_type"
						@change="$forceUpdate()"
					>
						<el-option
							v-for="item in propertyTypes"
							:key="item.id"
							:label="item.value"
							:value="item.id+''"
						/>
					</el-select>
					<span v-else>
						{{ computedPropertypes[officeBuilding.tenement_type] }}
					</span>
				</el-form-item>
			</div>
			<el-form-item
				class="flex-1"
				label="物业公司"
				prop="property_com_name"
			>
				<div
					v-if="isAdd||isEdit||isCreate||isDetailEdit"
					class="flex-row"
				>
					<el-select
						v-model="officeBuilding.property_com_name"
						class="detail-address-select flex-1"
						remote
						filterable
						placeholder="请输入关键词"
						:remote-method="getPropertyList"
						:loading="selectLoading"
						value-key="company_name"
						@change="selectProperty"
					>
						<el-option
							v-for="(item,index) in propertyList"
							:key="index"
							:label="item.company_name"
							:value="item"
						/>
					</el-select>
					<span class="flex-1">
						(物业公司若不存在，可直接<a
							class="new-property-button"
							@click="createPropery"
						>
							新增
						</a>)
					</span>
				</div>
				<span v-else>
					{{ officeBuilding.property_com_name || "--" }}
				</span>
			</el-form-item>
			<el-form-item
				class="flex-1"
				label="物业费"
				required
				prop="property_charge"
			>
				<div class="flex-row">
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="true"
						:intlength="8"
						:decimallength="2"
						:value="String(officeBuilding.property_charge)"
						@update:value="officeBuilding.property_charge=$event"
					/>
					<span v-else>
						{{ officeBuilding.property_charge || "--" }}
					</span>
					<span class="item-unit">
						元/㎡/月
					</span>
				</div>
			</el-form-item>
			<el-form-item
				label="预计入市时间"
				prop="in_the_market_time"
			>
				<div v-if="isAdd||isEdit||isCreate||isDetailEdit">
					<el-radio
						v-model="officeBuilding.in_market_time_to_date"
						label="1"
						@change="inMarketTimeRadioChange"
					>
						具体到日
					</el-radio>
					<el-radio
						v-model="officeBuilding.in_market_time_to_date"
						label="2"
						@change="inMarketTimeRadioChange"
					>
						具体到月
					</el-radio>
					<div>
						<el-date-picker
							v-if="officeBuilding.in_market_time_to_date==1"
							v-model="officeBuilding.in_the_market_time"
							type="date"
							placeholder="选择预计入市时间"
							value-format="yyyy-MM-dd"
						/>
						<el-date-picker
							v-else
							v-model="officeBuilding.in_the_market_time"
							type="month"
							placeholder="选择预计入市时间"
							value-format="yyyy-MM"
						/>
					</div>
					<span class="in-marketing-time-tip">
						<i>如果是转改建的楼，请输入改建后入市时间</i>
					</span>
				</div>
				<div v-else>
					{{ officeBuilding.in_the_market_time || "--" }}
				</div>
			</el-form-item>
			<el-form-item
				class="flex-1"
				label="得房率"
			>
				<div class="flex-row">
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="true"
						:intlength="2"
						:decimallength="2"
						:value="String(officeBuilding.construction_rate)"
						@update:value="officeBuilding.construction_rate=$event"
					/>
					<span v-else>
						{{ officeBuilding.construction_rate || "--" }}
					</span>
					<span class="item-unit">
						%
					</span>
				</div>
			</el-form-item>
			<el-form-item
				class="flex-1"
				label="产业聚集"
			>
				<div class="flex-row">
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.industrys"
						class="flex-1"
						multiple
						@change="checkIndustry"
					>
						<el-option
							v-for="item in industrysList"
							:key="item.id"
							:label="item.value"
							:value="item.id"
						/>
					</el-select>
					<span v-else>
						{{ computedIndustrys || "--" }}
					</span>
				</div>
				<div v-if="isAdd || isEdit || isCreate || isDetailEdit">
					<el-input
						v-if="computedCheckOtherIndustry"
						v-model="officeBuilding.industrys_other"
						maxlength="10"
						placeholder="10个字以内"
					/>
				</div>
				<div v-else>
					<span v-if="computedCheckOtherIndustry">
						其他：{{ officeBuilding.industrys_other }}
					</span>
				</div>
			</el-form-item>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="是否有新风系统"
					prop="is_nather"
				>
					<el-radio-group
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.is_nather"
					>
						<el-radio label="1">
							有
						</el-radio>
						<el-radio label="2">
							无
						</el-radio>
					</el-radio-group>
					<span v-else>
						<span v-if="officeBuilding.is_nather==1">
							有
						</span>
						<span v-else-if="officeBuilding.is_nather==2">
							无
						</span>
						<span v-else>
							--
						</span>
					</span>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="是否有暖风系统"
					prop="is_heater"
				>
					<el-radio-group
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.is_heater"
					>
						<el-radio label="1">
							有
						</el-radio>
						<el-radio label="2">
							无
						</el-radio>
					</el-radio-group>
					<span v-else>
						<span v-if="officeBuilding.is_heater==1">
							有
						</span>
						<span v-else-if="officeBuilding.is_heater==2">
							无
						</span>
						<span v-else>
							--
						</span>
					</span>
				</el-form-item>
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
				@click="saveOfficeBuilding"
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

		<!-- 新增物业公司dialog -->
		<el-dialog
			v-loading="dialogLoading"
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
							v-for="(item,index) in orgList"
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
import numberInput from "@/components/input_component.vue";
import unitInput from "@/components/unit_input_component.vue";
import {
	getAddressDetailList,
	saveBuilding
} from "@/api/officeApi.js";

import {
	ownOrgAdd,
	getTyOrgList,
	getTyOrgDetail
} from "@/api/api.js";

import {
	getPropertyList
} from "@/api/propertyApi.js";
export default {
	components: {
		numberInput,
		unitInput
	},
	props: {
		isCreate: {
			type: Boolean,
			default: false
		},
		areaOptions: {
			type: Array,
			default: () => []
		},
		index: Number,
		propertyOwnerList: Array,
		levels: Array,
		propertyTypes: Array,
		industrysList: Array
	},
	data() {
		let _areaValidator = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("请选择地区"));
			} else {
				callback();
			}
		};
		let _buildingNumberValidator = (rule, value, callback) => {
			let numReg = /[0-9]{3}/;

			if (!value) {
				return callback(new Error("请输入楼栋编号"));
			} else if (value.trim().length < 3) {
				return callback(new Error("请输入三位编号"));
			} else if (!numReg.test(value)) {
				return callback(new Error("请输入三位数字"));
			} else {
				callback();
			}
		};

		let _unitRule = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("请输入单元号"));
			} else if (value.trim().length < 3) {
				return callback(new Error("单元号不正确"));
			} else {
				callback();
			}
		};

		return {
			// 待选物业公司列表
			propertyList: [],
			isAdd: false,
			isDetail: false,
			isEdit: false,
			isDetailEdit: false,
			selectLoading: false,
			formRule: {
				building_name: [
					{required: true, message: "请输入楼栋名称", trigger: ["blur", "change"]}
				],
				building_num: [
					{required: true, validator: _buildingNumberValidator, trigger: "blur"},
				],
				selectedArea: [
					{required: true, validator: _areaValidator, trigger: "blur"}
				],
				detail_address: [
					{required: true, message: "请输入详细地址", trigger: ["blur", "change"]}
				],
				building_level: [
					{required: true, message: "请选择写字楼等级", trigger: ["blur", "change"]}
				],
				// divide_unit
				divide_unit: [
					{required: true, message: "请选择是否分单元", trigger: ["blur", "change"]}
				],
				// unit_num
				unit_num: [
					{required: true, message: "请输入单元数", trigger: ["blur", "change"]}
				],
				num_of_floor_levels: [
					{required: true, message: "请输入总层数", trigger: ["blur", "change"]}
				],
				// typical_floor_area typical_floor_height
				typical_floor_area: [
					{required: true, message: "请输入标准层建筑面积", trigger: ["blur", "change"]}
				],
				typical_floor_height: [
					{required: true, message: "请输入标准层高", trigger: ["blur", "change"]}
				],
				// tenement_type
				tenement_type: [
					{required: true, message: "请选择物业类型", trigger: ["blur", "change"]}
				],
				property_com_name: [
					{required: true, message: "请选择物业公司", trigger: ["blur", "change"]}
				],
				property_charge: [
					{required: true, message: "请输入物业费", trigger: ["blur", "change"]}
				]
			},
			addressOptions: [],
			selectedAddressData: {},
			showOtherIndustryInput: false,
			selectedProperty: {},
			addOrgModal: false,
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
			unitRule: [
				{validator: _unitRule, trigger: ["blur", "change"]}
			],
			orgList: [],
			loading: false,
			dialogLoading: false
		};
	},
	computed: {
		officeProject() {
			return this.$store.getters.officeProject;
		},
		officeBuilding() {
			let _officeBuilding = this.$store.getters.officeBuilding[this.index];

			return _officeBuilding;
		},
		// 检测产业聚焦是否含有其他
		computedArea() {
			let _province_name = this.officeBuilding.province_name ? this.officeBuilding.province_name : "";
			let _city_name = this.officeBuilding.city_name ? this.officeBuilding.city_name : "";
			let _district_name = this.officeBuilding.district_name ? this.officeBuilding.district_name : "";

			return _province_name + _city_name + _district_name;
		},
		computedBuildingLevel() {
			let _map = {};

			this.levels.forEach(item => {
				_map[item.id] = item.value;
			});
			return _map;
		},
		computedPropertyOwnerShip() {
			let _map = {};

			this.propertyOwnerList.forEach(item => {
				_map[item.id] = item.value;
			});
			return _map;
		},
		computedPropertypes() {
			let _map = {};

			this.propertyTypes.forEach(item => {
				_map[item.id] = item.value;
			});
			return _map;
		},
		computedIndustrys() {
			let _arr = [];

			this.industrysList.forEach(item => {
				if (this.officeBuilding.industrys.indexOf(item.id) != -1) {
					_arr.push(item.value);
				}
			});
			return _arr.join(", ");
		},
		computedCheckOtherIndustry() {
			let _ids = this.officeBuilding.industrys;

			if (_ids) {
				let _arr = this.industrysList.filter(item => (_ids.indexOf(item.id) != -1));
				let _valueArr = _arr.map(item => item.value);

				if (_valueArr && _valueArr.length > 0 && _valueArr.indexOf("其他") != -1) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	},
	mounted() {

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

		changeAreaSelect(e) {
			this.officeBuilding.selectedArea = e;
		},
		// 获取地址列表
		getAddressList(query) {
			if (!query) {
				return;
			}

			if (!this.officeBuilding.selectedArea || this.officeBuilding.selectedArea.length < 2) {
				return;
			}
			this.selectLoading = true;
			let _data = {
				city: this._getCityName(),
				address: query
			};

			getAddressDetailList(_data).then(res => {
				this.addressOptions = res.data;
				this.selectLoading = false;
			});
		},
		_getCityName() {
			let _cityList = [];
			let _provinceCode = this.officeBuilding.selectedArea[0];
			let _provinceArr = this.areaOptions.filter((item) => item.value == _provinceCode);

			if (!_provinceArr) {
				return "";
			}
			let _provinceObj = _provinceArr[0];

			_cityList = _provinceObj.children;
			let _cityArr = _cityList.filter(item => item.value == this.officeBuilding.selectedArea[1]);

			if (!_cityArr) {
				return "";
			}

			return _cityArr[0].label;
		},
		addressDetailChange(value) {
			this.officeBuilding.detail_address = value.name;
			this.selectedAddressData = value;
			this.$forceUpdate();
		},
		// 编辑
		edit() {
			this.isDetailEdit = true;
			this.checkIndustry();
		},
		// 取消
		cancel() {
			this.isDetailEdit = false;
		},
		// 保存
		saveOfficeBuilding() {
			this.$refs["officeBuildingForm"].validate((valid) => {
				if (valid) {
					this.loading = true;
					let _postData = this._getPostData();

					if (this.officeBuilding.id) {
						_postData.id = this.officeBuilding.id;
					}

					saveBuilding(_postData).then(res => {
						if (res && res.data) {
							this.$message.success("保存成功");
							this.$emit("updateOfficeBuilding");
						}
						this.loading = false;
					}).catch(res => {
						this.loading = false;
						this.$message.error(res.message ? res.message : "操作失败");
					});
				}
			});
		},
		// 获取楼栋表单数据
		_getPostData() {
			let _data = {
				project_id: this.$route.params.id,
				step: 1
			};
			let _keys = [
				"building_name",
				"building_num",
				"detail_address",
				"building_level",
				"divide_unit",
				"num_of_floor_levels",
				"typical_floor_area",
				"typical_floor_height",
				"tenement_type",
				"property_com_id",
				"property_charge",
				"is_nather",
				"is_heater",
				"construction_rate",
				"unit_num",
				"total_area",
				"in_the_market_time",
				"property_ownership",
				"work_total_area",
				"industrys_other",
				"longitude",
				"latitude",
				"industrys",
				"unit_list"
			];

			for (let key in this.officeBuilding) {
				if (Object.prototype.hasOwnProperty.call(this.officeBuilding, key)) {
					if (_keys.indexOf(key) != -1 && this.officeBuilding[key]) {
						_data[key] = this.officeBuilding[key];
					}
				}
			}
			// province_code city_code district_code longitude latitude 需特殊处理
			this.officeBuilding.selectedArea[0] && (_data.province_code = this.officeBuilding.selectedArea[0]);
			this.officeBuilding.selectedArea[1] && (_data.city_code = this.officeBuilding.selectedArea[1]);
			this.officeBuilding.selectedArea[2] && (_data.district_code = this.officeBuilding.selectedArea[2]);
			(this.selectedAddressData && this.selectedAddressData.longitude) && (_data.longitude = this.selectedAddressData.longitude);
			(this.selectedAddressData && this.selectedAddressData.latitude) && (_data.latitude = this.selectedAddressData.latitude);

			// 如果有新增单元
			if (this.officeBuilding.new_unit_list && this.officeBuilding.new_unit_list.length > 0) {
				let _unit_list = _data.unit_list.concat(this.officeBuilding.new_unit_list);

				_data.unit_list = _unit_list;
			}

			if (_data.divide_unit == 2) {
				_data.unit_list = [];
			}
			console.log(_data.unit_list);

			return _data;
		},
		// 检测产业聚焦是否含有其他
		checkIndustry() {
			let _ids = this.officeBuilding.industrys;
			let _arr = this.industrysList.filter(item => (_ids.indexOf(item.id) != -1));
			let _valueArr = _arr.map(item => item.value);

			if (_valueArr && _valueArr.length > 0 && _valueArr.indexOf("其他") != -1) {
				this.showOtherIndustryInput = true;
			} else {
				this.showOtherIndustryInput = false;
			}
		},
		// 获取物业公司列表
		getPropertyList(query) {
			if (!query) {
				return;
			}

			this.selectLoading = true;
			let _data = {
				keyword: query
			};

			getPropertyList(_data).then(res => {
				this.propertyList = res.data.list;
				this.selectLoading = false;
			});
		},

		// 选择物业公司
		selectProperty(e) {
			this.selectedProperty = e;
			this.officeBuilding.property_com_name = e.company_name;
			this.officeBuilding.property_com_id = e.id;
		},
		resetForm(formName) {
			this.addOrgModal = false;
			this.$refs[formName].resetFields();
		},
		saveOrg(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					ownOrgAdd(this.orgForm).then(res => {
						this.$message({
							message: res.message,
							type: "success"
						});
						this.addOrgModal = false;
						this.resetForm("orgForm");
						this.officeBuilding.property_com_name = res.data.org_name;
						this.officeBuilding.property_com_id = res.data.org_id;
					}).catch(err => {
						this.$message({
							message: err.message,
							type: "error"
						});
					});
				}
			});
		},
		// 搜索天眼查企业
		querySearchOrg(query) {
			this.selectLoading = true;
			if (query && query.length >= 5) {
				let params = {
					org_name: query,
				};

				getTyOrgList(params).then(res => {
					this.orgList = res.data;
					this.selectLoading = false;
				}).catch(err => {
					this.$message.warning(err.message || "未搜索到对应公司，请更换关键词搜索!");
					this.selectLoading = false;
				});
			} else {
				this.selectLoading = false;
				this.$message.warning("请输入至少5个字关键词搜索!");
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
		createPropery() {
			this.addOrgModal = true;
		},
		changeDivideUnit() {
			if (this.officeBuilding.divide_unit == 2) {
				this.officeBuilding.unit_num = 1;
			}
		},
		// 入市时间改变
		inMarketTimeRadioChange() {
			this.officeBuilding.in_the_market_time = "";
		},
		addUnit() {
			// 判断添加单元
			let _unit = this.officeBuilding.unit_list.concat(this.officeBuilding.new_unit_list);
			let _flag = false;

			// 判断是否有空单元
			_unit.forEach(item => {
				if (!item.unit) {
					_flag = true;
				}
			});
			if (_flag) {
				this.$message.error("单元号不能为空");
				return;
			}
			let _temp = {};

			_unit.forEach(item => {
				if (_temp[item.unit]) {
					_flag = true;
				} else {
					_temp[item.unit] = true;
				}
			});
			if (_flag) {
				this.$message.error("单元号不能重复");
				return;
			}

			this.officeBuilding.new_unit_list.push({
				unit: ""
			});
		},
		removeUnit(index) {
			this.officeBuilding.new_unit_list.splice(index, 1);
			this.$forceUpdate();
		},

		updateNewUnitList(index, e) {
			this.officeBuilding.new_unit_list[index].unit = e;
			this.$forceUpdate();
		},
		updateUnitList(index, e) {
			this.officeBuilding.unit_list[index].unit = e;
			this.$forceUpdate();
		},

		// 检查楼栋编码，不足三位，前面补0
		checkBuildingNum(e) {
			if (e && e.length < 3) {
				let _pre = "";

				for (let i = 0, _len = 3 - e.length; i < _len; i++) {
					_pre = _pre + "0";
				}
				e = _pre + e;
				this.officeBuilding.building_num = e;
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url(./common.less);
.industry-other-container {
	margin-bottom: 22px;
}
.detail-address-select {
	width: 100%;
}
.new-property-button {
	cursor: pointer;
	color: #409EFF;
}
.area-select {
	width: 100%;
}
.unit-container {
	padding: 10px;
	border: 1px solid #dcdfe6;
	border-radius: 10px;
}
.remove-unit-button {
	margin-left: 10px;
}
.in-marketing-time-tip {
	color: #409EFF;
	font-size: 12px;
}
</style>