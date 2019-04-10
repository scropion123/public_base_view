<template>
	<div v-loading="loading">
		<el-form
			ref="officeBuildingForm"
			label-width="150px"
			label-position="left"
			:model="officeBuilding"
			:rules="rules"
		>
			<div class="flex-row">
				<!-- 建筑类型 -->
				<el-form-item
					class="flex-1"
					label="建筑类型"
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.building_type"
					>
						<el-option
							v-for="item in buildingTypeList"
							:key="item.id"
							:label="item.value"
							:value="item.id+''"
						/>
					</el-select>
					<span v-else>
						{{ computedBuildingType[officeBuilding.building_type] }}
					</span>
				</el-form-item>
				<!-- 外墙 -->
				<el-form-item
					class="flex-1"
					label="外墙"
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.facade_type"
					>
						<el-option
							v-for="item in facadeTypeList"
							:key="item.id"
							:label="item.value"
							:value="item.id+''"
						/>
					</el-select>
					<span v-else>
						{{ computedFacadeType[officeBuilding.facade_type] }}
					</span>
				</el-form-item>
			</div>
			<!-- 楼板承重 -->
			<el-form-item label="楼板承重">
				<div class="flex-row">
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="true"
						:intlength="5"
						:decimallength="2"
						:value="String(officeBuilding.floor_load)"
						@update:value="officeBuilding.floor_load=$event"
					/>
					<span v-else>
						{{ officeBuilding.floor_load }}
					</span>
					<span class="item-unit">
						kg
					</span>
				</div>
			</el-form-item>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="地上层数"
					prop="up_floors"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="3"
						:value="String(officeBuilding.up_floors)"
						@update:value="officeBuilding.up_floors=$event"
					/>
					<span v-else>
						{{ officeBuilding.up_floors }}
					</span>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="地下层数"
					prop="down_floors"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="3"
						:value="String(officeBuilding.down_floors)"
						@update:value="officeBuilding.down_floors=$event"
					/>
					<span v-else>
						{{ officeBuilding.down_floors }}
					</span>
				</el-form-item>
			</div>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="可出租层数"
					prop="rent_floors"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="3"
						:value="String(officeBuilding.rent_floors)"
						@update:value="officeBuilding.rent_floors=$event"
					/>
					<span v-else>
						{{ officeBuilding.rent_floors }}
					</span>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="可出售层数"
					prop="sales_floors"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="3"
						:value="String(officeBuilding.sales_floors)"
						@update:value="officeBuilding.sales_floors=$event"
					/>
					<span v-else>
						{{ officeBuilding.sales_floors }}
					</span>
				</el-form-item>
			</div>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="层净高"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="2"
							:decimallength="2"
							:value="String(officeBuilding.floor_height)"
							@update:value="officeBuilding.floor_height=$event"
						/>
						<span v-else>
							{{ officeBuilding.floor_height }}
						</span>
						<span class="item-unit">
							m
						</span>
					</div>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="单平电容量"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="2"
							:decimallength="2"
							:value="String(officeBuilding.electric_capacity)"
							@update:value="officeBuilding.electric_capacity=$event"
						/>
						<span v-else>
							{{ officeBuilding.electric_capacity }}
						</span>
						<span class="item-unit">
							伏
						</span>
					</div>
				</el-form-item>
			</div>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="大堂层高"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="2"
							:decimallength="2"
							:value="String(officeBuilding.foyer_height)"
							@update:value="officeBuilding.foyer_height=$event"
						/>
						<span v-else>
							{{ officeBuilding.foyer_height }}
						</span>
						<span class="item-unit">
							m
						</span>
					</div>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="大堂面积"
				>
					<div class="flex-row">
						<numberInput
							v-if="isAdd||isEdit||isCreate||isDetailEdit"
							:is-decimal="true"
							:intlength="2"
							:decimallength="2"
							:value="String(officeBuilding.foyer_area)"
							@update:value="officeBuilding.foyer_area=$event"
						/>
						<span v-else>
							{{ officeBuilding.foyer_area }}
						</span>
						<span class="item-unit">
							㎡
						</span>
					</div>
				</el-form-item>
			</div>
			<!-- 本栋租金范围 -->
			<el-form-item label="本栋租金范围">
				<div v-if="isAdd||isEdit||isCreate||isDetailEdit">
					<div v-if="!officeBuilding.building_price || officeBuilding.building_price.length == 0">
						<el-button
							class="add-price-button"
							type="primary"
							icon="el-icon-plus"
							circle
							@click="addBuildingPrice"
						/>
					</div>
					<div
						v-for="(item,index) in officeBuilding.building_price"
						:key="index"
						class="flex-row"
					>
						<div class="flex-1 flex-row">
							<el-date-picker
								v-model="officeBuilding.building_price[index].time"
								type="date"
								placeholder="选择日期"
								value-format="yyyy-MM-dd"
								style="width: 150px;"
								class="m-r"
							/>
							<numberInput
								style="width: 150px;"
								:is-decimal="true"
								:intlength="5"
								:decimallength="2"
								:value="String(officeBuilding.building_price[index].start_price)"
								@update:value="officeBuilding.building_price[index].start_price=$event"
							/>
							<span class="price-space">
								——
							</span>
							<numberInput
								style="width: 150px;"
								class="m-r"
								:is-decimal="true"
								:intlength="5"
								:decimallength="2"
								:value="String(officeBuilding.building_price[index].end_price)"
								@update:value="officeBuilding.building_price[index].end_price=$event"
							/>
						</div>
						<div class="flex-row">
							<el-select
								v-model="officeBuilding.building_price[index].price_unit"
								class="price-unit class-1"
								placeholder="请选择单位"
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
									@click="removeBuildingPrice(item, index)"
								/>
								<el-button
									v-if="index==officeBuilding.building_price.length - 1"
									class="add-price-button"
									type="primary"
									icon="el-icon-plus"
									circle
									@click="addBuildingPrice"
								/>
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<div v-if="officeBuilding.building_price && officeBuilding.building_price.length > 0">
						<div
							v-for="(item, index) in officeBuilding.building_price"
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
import numberInput from "@/components/input_component.vue";
import _ from "lodash";
import moment from "moment";
import {
	saveBuilding
} from "@/api/officeApi.js";
export default {
	components: {
		numberInput
	},
	props: {
		index: Number,
		isCreate: {
			type: Boolean,
			default: false
		},
		buildingTypeList: Array,
		facadeTypeList: Array,
		priceUnitList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			isAdd: false,
			isDetail: false,
			isEdit: false,
			isDetailEdit: false,
			loading: false,
			rules: {
				up_floors: [
					{required: true, message: "请输入地上层数", trigger: ["blur", "change"]}
				],
				down_floors: [
					{required: true, message: "请输入地下层数", trigger: ["blur", "change"]}
				]
			}
		};
	},
	computed: {
		officeProject() {
			return this.$store.getters.officeProject;
		},
		officeBuilding() {
			return this.$store.getters.officeBuilding[this.index];
		},
		computedBuildingType() {
			let _map = {};

			if (this.buildingTypeList) {
				this.buildingTypeList.forEach(item => {
					_map[item.id] = item.value;
				});
			}
			return _map;
		},
		computedFacadeType() {
			let _map = {};

			if (this.facadeTypeList) {
				this.facadeTypeList.forEach(item => {
					_map[item.id] = item.value;
				});
			}
			return _map;
		},
		priceUnitListMap() {
			let _map = {};

			if (this.priceUnitList && this.priceUnitList.length > 0) {
				this.priceUnitList.forEach((item) => {
					_map[item.id] = item.value;
				});
			}
			return _map;
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
	mounted() {
		if (this.officeBuilding && this.officeBuilding.building_price && this.officeBuilding.building_price.length > 0) {
			for (let i = 0, _len = this.officeBuilding.building_price.length; i < _len; i++) {
				this.officeBuilding.building_price[i].priceUnitList = _.clone(this.priceUnitList);
			}
		} else {
			this.officeBuilding.building_price = [{
				start_price: "",
				end_price: "",
				time: moment(new Date()).format("YYYY-MM-DD"),
				price_unit: ""
			}];
		}
	},
	methods: {
		cancel() {
			this.isDetailEdit = false;
		},
		// 编辑按钮
		edit() {
			this.isDetailEdit = true;
		},
		save() {
			this.$refs["officeBuildingForm"].validate((valid) => {
				if (valid) {
					let _data = this._getPostData();

					saveBuilding(_data).then(res => {
						if (res && res.data) {
							this.$message.success("保存成功");
							this.$emit("updateOfficeBuilding");
						}
						this.loading = false;
					}).catch(res => {
						this.loading = false;
						this.$message.error(res.message ? res.message : "保存失败");
					});
				}
			});
		},
		_getPostData() {
			let _data = {
				project_id: this.$route.params.id,
				building_id: this.officeBuilding.id,
				step: 2
			};

			if (this.officeBuilding.other_id) {
				_data.other_id = this.officeBuilding.other_id;
			}
			let _key = ["building_type", "floor_load", "facade_type", "up_floors", "down_floors", "rent_floors", "sales_floors", "floor_height", "electric_capacity", "foyer_height", "foyer_area", "building_price"];

			_key.forEach(item => {
				if (this.officeBuilding[item]) {
					_data[item] = this.officeBuilding[item];
				}
			});

			return _data;
		},
		// 新增本栋租金范围
		addBuildingPrice() {
			let _item = {
				start_price: "",
				end_price: "",
				time: new Date(),
				priceUnitList: _.clone(this.priceUnitList)
			};

			this.officeBuilding.building_price.push(_item);
		},
		// 删除本栋租金范围
		removeBuildingPrice(item, index) {
			// 该条price_unit在其他条目中为可选
			if (this.officeBuilding && this.officeBuilding.building_price && this.officeBuilding.building_price.length > 0) {
				this.officeBuilding.building_price.splice(index, 1);
			}
		},
	}
};
</script>
<style lang="less" scoped>
@import url(./common.less);
.price-unit-label {
  flex: 1;
  margin-left: 10px;
  min-width: 50px;
  text-align: center;
}
.m-r {
	margin-right: 10px;
}
</style>