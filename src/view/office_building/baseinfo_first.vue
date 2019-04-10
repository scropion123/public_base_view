<template>
	<!-- 基本信息 -->
	<div
		v-loading="loading"
		class="baseinfo-container"
	>
		<el-form
			ref="baseinfoForm"
			class="baseinfo-form"
			label-width="150px"
			:model="officeProject"
			:rules="baseInfoRules"
		>
			<el-form-item
				label="项目名称"
				prop="project_name"
			>
				<el-input
					v-if="isAdd||isEdit||isDetailEdit"
					v-model="officeProject.project_name"
					maxlength="20"
					placeholder="20字以内"
				/>
				<span v-else>
					{{ officeProject.project_name }}
				</span>
			</el-form-item>
			<el-form-item
				label="是否独栋"
				prop="is_single"
			>
				<el-radio-group
					v-if="isAdd||isEdit||isDetailEdit"
					v-model="officeProject.is_single"
					@change="isSingleChange"
				>
					<el-radio label="1">
						是
					</el-radio>
					<el-radio label="2">
						否
					</el-radio>
				</el-radio-group>
				<span v-else>
					{{ officeProject.is_single==1?'是':'否' }}
				</span>
			</el-form-item>
			<el-form-item
				v-if="officeProject.is_single==2"
				label="楼栋数"
				prop="building_num"
			>
				<numberInput
					v-if="isAdd||isEdit||isDetailEdit"
					:is-decimal="false"
					:intlength="2"
					:value="String(officeProject.building_num)"
					@update:value="officeProject.building_num=$event"
				/>
				<span v-else>
					{{ officeProject.building_num }}
				</span>
			</el-form-item>
			<el-form-item
				v-else
				label="楼栋数"
				prop="building_num"
				required
			>
				{{ officeProject.building_num }}
			</el-form-item>
			<el-form-item
				label="所在地区"
				prop="selectedArea"
			>
				<el-cascader
					v-if="isAdd||isEdit||isDetailEdit"
					placeholder="请选择区域"
					:options="areaOptions"
					:value="officeProject.selectedArea"
					clearable
					@change="changeAreaSelect"
				/>
				<span v-else>
					{{ computedDistrict }}
				</span>
			</el-form-item>
			<el-form-item
				label="详细地址"
				prop="address"
			>
				<el-select
					v-if="isAdd||isEdit||isDetailEdit"
					v-model="officeProject.address"
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
					{{ officeProject.address }}
				</span>
			</el-form-item>
			<!-- 项目图片 -->
			<el-form-item label="项目图片">
				<div v-if="isAdd||isEdit||isDetailEdit">
					<el-upload
						:action="fileUpload"
						multiple
						:data="uploadData"
						list-type="picture-card"
						accept=".bmp,.png,.gif,.jpg,.jpeg"
						:on-success="uploadSuccess"
						:on-remove="uploadRemove"
						:before-upload="beforeUpload"
						:file-list="officeProject.image_url_list"
						:limit="10"
						:on-exceed="fileExceed"
					>
						<el-button
							type="primary"
						>
							点击上传
						</el-button>
						<div
							slot="tip"
							class="el-upload__tip"
						>
							文件大小不超过2M,个数不超过10个
						</div>
					</el-upload>
				</div>
				<div v-else>
					<img
						v-for="(item, index) in officeProject.image_url_list"
						:key="index"
						:src="item.response.data.url"
						class="project-image-detail"
						@click="viewImg(item.response.data.url)"
					>
				</div>
			</el-form-item>
			<el-form-item
				label="办公总面积"
				prop="work_total_area"
			>
				<div class="total-area-row">
					<numberInput
						v-if="isAdd||isEdit||isDetailEdit"
						:is-decimal="true"
						:intlength="8"
						:decimallength="2"
						:value="String(officeProject.work_total_area)"
						@update:value="officeProject.work_total_area=$event"
					/>
					<span v-else>
						{{ officeProject.work_total_area || "--" }}
					</span>
					<span class="total-area-unit">
						㎡
					</span>
				</div>
			</el-form-item>
			<el-form-item label="商圈">
				<!-- 这里是多选 -->
				<el-select
					v-if="isAdd||isEdit||isDetailEdit"
					v-model="officeProject.business_area_ids"
					multiple
					@change="$forceUpdate()"
				>
					<el-option
						v-for="item in officeProject.business_area"
						:key="item.business_area_id"
						:value="item.business_area_id"
						:label="item.business_area_name"
					/>
				</el-select>
				<span v-else>
					<span v-if="officeProject.business_area && officeProject.business_area.length > 0">
						<a
							v-for="(item, index) in officeProject.business_area"
							:key="index"
							class="business-area-item"
							@click="goBusinessArea(item)"
						>
							{{ item.business_area_name }}
						</a>
					</span>
					<span v-else>
						--
					</span>
				</span>
			</el-form-item>
			<el-form-item label="价格范围">
				<div v-if="isAdd||isEdit||isDetailEdit">
					<div v-if="!officeProject.business_price || officeProject.business_price.length == 0">
						<el-button
							class="add-price-button"
							type="primary"
							icon="el-icon-plus"
							circle
							@click="addPrice"
						/>
					</div>
					<div
						v-for="(item,index) in officeProject.business_price"
						:key="index"
						class="flex-row"
					>
						<numberInput
							:is-decimal="true"
							:intlength="5"
							:decimallength="2"
							:value="String(item.start_price)"
							@update:value="item.start_price=$event"
						/>
						<span class="price-space">
							——
						</span>
						<numberInput
							:is-decimal="true"
							:intlength="5"
							:decimallength="2"
							:value="String(item.end_price)"
							@update:value="item.end_price=$event"
						/>
						<label class="price-unit-label">
							单位
						</label>
						<el-select
							v-model="item.price_unit"
							class="price-unit"
							@change="changePriceUnit(index)"
						>
							<el-option
								v-for="subItem in priceUnitList"
								:key="subItem.id"
								:label="subItem.value"
								:value="subItem.id + ''"
								:disabled="subItem.id != item.price_unit && subItem.disabled"
							/>
						</el-select>
						<div class="row-button-container">
							<el-button
								class="add-price-button"
								type="danger"
								icon="el-icon-minus"
								circle
								@click="removePrice(item, index)"
							/>
							<el-button
								v-if="index==officeProject.business_price.length - 1"
								class="add-price-button"
								type="primary"
								icon="el-icon-plus"
								circle
								@click="addPrice"
							/>
						</div>
					</div>
				</div>
				<div v-else>
					<div v-if="officeProject.business_price && officeProject.business_price.length > 0">
						<div
							v-for="(item, index) in officeProject.business_price"
							:key="index"
						>
							{{ item.start_price }} - {{ item.end_price }} {{ priceUnitListMap[item.price_unit] }}
						</div>
					</div>
					<span v-else>
						--
					</span>
				</div>
			</el-form-item>
			<el-form-item label="招商电话">
				<div v-if="isAdd||isEdit||isDetailEdit">
					<div v-if="officeProject.investmentTelList && officeProject.investmentTelList.length == 0">
						<el-button
							class="add-price-button"
							type="primary"
							icon="el-icon-plus"
							circle
							@click="addInvestmentTel"
						/>
					</div>
					<div
						v-for="(item,index) in officeProject.investmentTelList"
						:key="index"
						class="flex-row"
					>
						<numberInput
							:is-decimal="false"
							:intlength="11"
							:value="String(officeProject.investmentTelList[index])"
							@update:value="officeProject.investmentTelList[index]=$event"
						/>
						<div class="row-button-container">
							<el-button
								class="add-price-button"
								type="danger"
								icon="el-icon-minus"
								circle
								@click="removeInvestmentTel(index)"
							/>
							<el-button
								v-if="index==officeProject.investmentTelList.length - 1"
								class="add-price-button"
								type="primary"
								icon="el-icon-plus"
								circle
								@click="addInvestmentTel(index)"
							/>
						</div>
					</div>
				</div>
				<div v-else>
					{{ officeProject.investment_tel || "--" }}
				</div>
			</el-form-item>
			<!-- 开发商 -->
			<el-form-item
				label="开发商"
				prop="developer"
			>
				<el-input
					v-if="isAdd||isEdit||isDetailEdit"
					v-model="officeProject.developer"
					placeholder="请输入开发商信息, 20字以内"
					maxlength="20"
				/>
				<span v-else>
					{{ officeProject.developer || "--" }}
				</span>
			</el-form-item>
			<!-- 物业类型	 -->
			<el-form-item label="物业类型">
				<el-select
					v-if="isAdd||isEdit||isDetailEdit"
					v-model="officeProject.property_list_ids"
					multiple
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
					{{ computedProperty || "--" }}
				</span>
			</el-form-item>
		</el-form>
		<div
			v-if="officeProject.is_administrator || isAdd"
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
import util from "@/util/util.js";
import _ from "lodash";

import {
	getPriceUnitList,
	getPropertyTypes,
	getAddressDetailList,
	getSimpleList,
	createBuildingProjectFirst,
	updateBuildingProjectFirst
} from "@/api/officeApi.js";

import {
	getDicAreaCode
} from "@/api/api.js";

import {
	fileUpload
} from "@/api/commonApi.js";

export default {
	components: {
		numberInput,
	},
	props: {

	},
	data() {
		// 项目名称检验规则
		let _projectNameValidator = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("项目名称不能为空"));
			} else {
				callback();
			}
		};
		// 是否独栋检验规则
		let _isSingleValidator = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("请确认是否独栋"));
			} else {
				callback();
			}
		};
		// 楼栋数检验规则
		let _isBuildingNumValidator = (rule, value, callback) => {
			if (!(value + "")) {
				return callback(new Error("楼栋数不能为空"));
			} else if (parseInt(value) == 0) {
				return callback(new Error("楼栋数不能为0"));
			} else {
				callback();
			}
		};
		// 所在地区检验规则
		let _areaValidator = (rule, value, callback) => {
			if (!value || value.length == 0) {
				return callback(new Error("请选择所在的地区"));
			} else {
				callback();
			}
		};

		// 详细地址检验规则
		let _addressValidator = (rule, value, callback) => {
			if (!value || value.length == 0) {
				return callback(new Error("请输入详细地址"));
			} else {
				callback();
			}
		};

		let _nameValidator = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("开发商联系人不能为空"));
			} else {
				callback();
			}
		};
		let _phoneValidator = (rule, value, callback) => {
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
			selectLoading: false,
			// 选择的商圈
			areaOptions: [],
			fileUpload: fileUpload(),
			propertyTypes: [],
			priceUnitList: [],
			baseInfoRules: {
				project_name: [
					{required: true, validator: _projectNameValidator, trigger: "blur"}
				],
				is_single: [
					{required: true, validator: _isSingleValidator, trigger: "blur"}
				],
				building_num: [
					{required: true, validator: _isBuildingNumValidator}
				],
				address: [
					{required: true, validator: _addressValidator, trigger: "blur"}
				],
				selectedArea: [
					{required: true, validator: _areaValidator, trigger: "blur"}
				],
			},
			phoneRule: [
				{validator: _phoneValidator, trigger: "blur"}
			],
			nameRule: [
				{validator: _nameValidator, trigger: "blur"}
			],
			isAdd: false,
			isDetail: false,
			isEdit: false,
			isDetailEdit: false,
			// 选中的详细地址
			selectedAddressData: {},
			addressOptions: [],
			loading: false,
			uploadData: {type: 1}
		};
	},
	computed: {
		computedDistrict() {
			let _obj = this.officeProject;

			return _obj.province_name + _obj.city_name + _obj.district_name;
		},
		// 价格类型map
		priceUnitListMap() {
			let _map = {};

			if (this.priceUnitList && this.priceUnitList.length > 0) {
				this.priceUnitList.forEach((item) => {
					_map[item.id] = item.value;
				});
			}
			return _map;
		},
		// 物业类型
		computedProperty() {
			let _arr = [];

			this.officeProject.property_list && this.officeProject.property_list.forEach(item => {
				_arr.push(item.type_name);
			});
			return _arr.join(", ");
		},
		officeProject() {
			return this.$store.getters.officeProject;
		}
	},
	async mounted() {
		// 获取价格单位数组
		await this._getPriceUnitList();
		if (this.officeProject && this.officeProject.business_price) {
			for (let i = 0, _len = this.officeProject.business_price.length; i < _len; i++) {
				this.officeProject.business_price[i].priceUnitList = _.clone(this.priceUnitList);
			}
		}
		// 获取省市区
		this._getDicAreaCode();
		// 获取物业类型
		this._getPropertyTypes();
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
		// 获取省市区
		_getDicAreaCode() {
			getDicAreaCode().then(res => {
				this.areaOptions = res.data;
			});
		},
		addPrice() {
			let _item = {
				start_price: "",
				end_price: "",
				priceUnitList: _.clone(this.priceUnitList)
			};

			this.officeProject.business_price.push(_item);
			this.resetPriceUnitList();
		},
		removePrice(item, index) {
			// 该条price_unit在其他条目中为可选
			this.officeProject.business_price.splice(index, 1);
			this.resetPriceUnitList();
		},
		addInvestmentTel(index) {
			let item = this.officeProject.investmentTelList[index];

			if (!item) {
				this.$message.error("请输入招商电话");
				return;
			}
			if (!util.phoneReg.test(item)) {
				this.$message.error("请输入正确招商电话");
				return;
			}
			this.officeProject.investmentTelList.push("");
			this.$forceUpdate();
		},
		removeInvestmentTel(index) {
			this.officeProject.investmentTelList.splice(index, 1);
			this.$forceUpdate();
		},
		// 保存
		save() {
			this.$refs["baseinfoForm"].validate((valid) => {
				if (valid) {
					// 招商电话判断重复 investmentTelList
					let _msg = this.checkInvestmentTelList();

					if (_msg) {
						this.$message.error(_msg);
						return;
					}
					// 获取post表单数据
					this.loading = true;
					let _obj = this._getPostData();

					if (this.$route.params && this.$route.params.id) {
						_obj.id = this.$route.params.id;
						updateBuildingProjectFirst(_obj).then(res => {
							if (res.data && res.data.length > 0) {
								this.loading = false;
								this.$message.success("更新成功");
								this.$emit("updateBuilding");
							} else {
								this.loading = false;
								this.$message.error("新增失败");
							}
						}).catch(res => {
							this.loading = false;
							this.$message.error(res.message ? res.message : "新增失败");
						});
					} else {
						createBuildingProjectFirst(_obj).then(res => {
							if (res.data && res.data.length > 0) {
								this.loading = false;
								this.$router.push({
									name: "edit_office_building",
									params: {
										id: res.data[0]
									}
								});
							} else {
								this.loading = false;
								this.$message.error("新增失败");
							}
						}).catch(res => {
							this.loading = false;
							this.$message.error(res.message ? res.message : "新增失败");
						});
					}
				}
			});
		},
		_getPostData() {
			let _obj = {};

			_obj = _.clone(this.officeProject);
			if (this.selectedAddressData && this.selectedAddressData.longitude) {
				_obj.longitude = this.selectedAddressData.longitude;
				_obj.latitude = this.selectedAddressData.latitude;
			}
			_obj.selectedArea[0] && (_obj.province_code = _obj.selectedArea[0]);
			_obj.selectedArea[1] && (_obj.city_code = _obj.selectedArea[1]);
			_obj.selectedArea[2] && (_obj.district_code = _obj.selectedArea[2]);
			if (_obj.investmentTelList && _obj.investmentTelList.length > 0) {
				let _arr = _obj.investmentTelList.filter(item => item.length > 0);

				if (_arr && _arr.length > 0) {
					_obj.investment_tel = _arr.join(",");
				} else {
					_obj.investment_tel = "";
				}
			} else {
				_obj.investment_tel = "";
			}

			if (this.$route.params && this.$route.params.id) {
				_obj.property_list = this._generatePropertyList();
				_obj.business_area = this._generateBusinessArea();
			} else {
				_obj.property_list = _obj.property_list_ids;
				_obj.business_area = _obj.business_area_ids;
			}

			_obj.image_urls = [];

			// 处理图片
			if (this.officeProject.image_url_list && this.officeProject.image_url_list.length > 0) {
				this.officeProject.image_url_list.forEach(item => {
					_obj.image_urls.push(item.response.data.route);
				});
			}
			return _obj;
		},
		// 编辑状态下组装物业类型
		_generatePropertyList() {
			let _arr = [];

			this.officeProject.property_list_ids.forEach(item => {
				let _oldFlag = false;

				this.officeProject.property_list.forEach(subItem => {
					if (item == subItem.type_id) {
						_oldFlag = true;
						_arr.push(subItem);
					}
				});
				if (!_oldFlag) {
					this.propertyTypes.forEach(subItem => {
						if (subItem.id == item) {
							_arr.push({
								project_id: this.$route.params.id,
								type_id: item
							});
						}
					});
				}
			});

			return _arr;
		},
		// 编辑状态下组装商圈数据
		_generateBusinessArea() {
			let _arr = [];

			this.officeProject.business_area_ids.forEach(item => {
				this.officeProject.business_area.forEach(subItem => {
					if (item == subItem.business_area_id) {
						_arr.push(subItem);
					}
				});
			});

			return _arr;
		},

		// 检查是否有无效电话，跳过空字符串
		_checkPhone() {
			if (!this.officeProject.investmentPhone || this.officeProject.investmentPhone.length == 0) {
				return false;
			}
			this.officeProject.investmentPhone.forEach(item => {
				if (item && item.trim()) {
					if (!util.phoneReg.test(item)) {
						this.$message.error("请输入有效招商电话");
						return true;
					}
				}
			});
		},
		// 编辑
		edit() {
			this.isDetailEdit = true;
		},
		// cancel取消编辑
		cancel() {
			this.isDetailEdit = false;
			this._resetFields("baseinfoForm");
			this.$emit("updateBuilding");
		},
		_resetFields(form) {
			this.$refs[form] && this.$refs[form].resetFields();
		},
		// 查看商圈详情
		goBusinessArea(item) {
			let _url = this.$router.resolve({
				path: `/base/business/detail/${item.business_area_id}`,
			});

			_url.href && window.open(_url.href);
		},
		// 获取价格单位接口哦
		async _getPriceUnitList() {
			await getPriceUnitList().then((res) => {
				res.data.forEach(item => {
					item.disabled = false;
				});
				this.priceUnitList = res.data;
			});
		},
		// 获取物业类型
		_getPropertyTypes() {
			getPropertyTypes().then(res => {
				this.propertyTypes = res.data;
			});
		},
		// 获取地址列表
		getAddressList(query) {
			if (!query) {
				return;
			}

			if (!this.officeProject.selectedArea || this.officeProject.selectedArea.length < 2) {
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
		changeAreaSelect(e) {
			this.officeProject.selectedArea = e;
		},
		_getCityName() {
			let _cityList = [];
			let _provinceCode = this.officeProject.selectedArea[0];
			let _provinceArr = this.areaOptions.filter((item) => item.value == _provinceCode);

			if (!_provinceArr) {
				return "";
			}
			let _provinceObj = _provinceArr[0];

			_cityList = _provinceObj.children;
			let _cityArr = _cityList.filter(item => item.value == this.officeProject.selectedArea[1]);

			if (!_cityArr) {
				return "";
			}

			return _cityArr[0].label;
		},

		// addressDetailChange 详细地址选择
		addressDetailChange(value) {
			this.officeProject.address = value.name;
			this.selectedAddressData = value;
			// 清除原来的商圈信息
			this.officeProject.business_area_ids = [];
			this.$forceUpdate();
			// 根据经纬度获取商圈
			this._getSimpleList();
		},

		// isSingleChange 是否独栋选择
		isSingleChange(value) {
			if (value == 1) {
				this.officeProject.building_num = 1;
			} else {
				this.officeProject.building_num = "";
			}
		},

		// 修改价格范围单位
		changePriceUnit() {
			this.resetPriceUnitList();
		},

		// 已经选择的价格单位
		getSelectedPriceUnit() {
			let _arr = [];

			this.officeProject.business_price.forEach(item => {
				if (item.price_unit) {
					_arr.push(item.price_unit);
				}
			});
			return _arr;
		},

		// 重置价格范围数组里每个条目的单位数组
		resetPriceUnitList() {
			// 获取已选
			let _arr = this.getSelectedPriceUnit();

			for (let i = 0, _len = this.priceUnitList.length; i < _len; i++) {
				if (_arr.indexOf(this.priceUnitList[i].id + "") != -1) {
					this.priceUnitList[i].disabled = true;
				} else {
					this.priceUnitList[i].disabled = false;
				}
			}
		},

		// 获取商圈数据
		_getSimpleList() {
			let _data = {
				district_code: this.officeProject.selectedArea[2],
				latitude: this.selectedAddressData.latitude || this.officeProject.latitude,
				longitude: this.selectedAddressData.longitude || this.officeProject.longitude
			};

			getSimpleList(_data).then(res => {
				this.officeProject.business_area = res.data;
				if (!this.officeProject.business_area_ids || this.officeProject.business_area_ids.length == 0) {
					if (res.data && res.data.length > 0) {
						this.officeProject.business_area_ids = [res.data[0].business_area_id];
					}
				}
			});
		},
		// 招商电话检查
		checkInvestmentTelList() {
			let _msg = "";
			let _map = {};

			if (this.officeProject.investmentTelList && this.officeProject.investmentTelList.length > 0) {
				for (let i = 0, _len = this.officeProject.investmentTelList.length; i < _len; i++) {
					let _item = this.officeProject.investmentTelList[i];

					if (!_item) {
						continue;
					} else {
						if (!util.phoneReg.test(_item)) {
							_msg = "请输入正确招商电话";
							return _msg;
						} else {
							if (_map[_item]) {
								_msg = "招商电话有重复";
								return _msg;
							} else {
								_map[_item] = 1;
							}
						}
					}
				}
			}

			return _msg;
		},
		// 写字楼图片
		uploadRemove(file, fileList) {
			this.officeProject.image_url_list = fileList;
		},
		uploadSuccess(response, file, fileList) {
			if (response.statuscode != 1) {
				this.$message.error(file.name + "文件上传失败！");
				let index = fileList.indexOf(file);

				fileList.splice(index, 1);
				this.officeProject.image_url_list = fileList;
			} else {
				this.officeProject.image_url_list = fileList;
			}
		},
		beforeUpload(file) {
			let isLt2M = file.size / 1024 / 1024 < 2;

			if (!isLt2M) {
				this.$message.error("上传文件大小不能超过 2MB!");
				return false;
			}
			return true;
		},
		// 查看图片
		viewImg(src) {
			if (src) {
				window.open(src);
			}
		},

		// 图片超过个数限制
		fileExceed() {
			this.$message.error("最多上传10张图片");
			return false;
		}
	}
};
</script>

<style lang="less" scoped>
@import url(./common.less);
.el-cascader {
  width: 100%;
}
.el-select {
  width: 100%;
}

.total-area-row {
  display: flex;
  align-items: center;
  .total-area-unit {
    margin-left: 10px;
  }
}
.price-unit-label {
  flex: 1;
  margin-left: 10px;
  min-width: 50px;
  text-align: center;
}
.price-space {
  margin-left: 10px;
  margin-right: 10px;
}
.business-area-item {
  cursor: pointer;
  margin-right: 20px;
  color: #409EFF;
}
.developer-tel {
  margin-left: 20px;
}
.project-image-detail {
	height: 146px;
	width: 146px;
	margin-right: 2px;
	margin-bottom: 2px;
	cursor: pointer;
	border-radius: 5px;
}
</style>
