<template>
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
			<!-- 预计入市时间 -->
			<el-form-item
				label="预计入市时间"
				prop="entry_time"
			>
				<div v-if="isAdd||isEdit||isDetailEdit">
					<el-radio
						v-model="officeProject.entry_time_date"
						label="1"
						@change="changeEntryRadio"
					>
						具体到日
					</el-radio>
					<el-radio
						v-model="officeProject.entry_time_date"
						label="2"
						@change="changeEntryRadio"
					>
						具体到月
					</el-radio>
					<div>
						<el-date-picker
							v-if="officeProject.entry_time_date==1"
							v-model="officeProject.entry_time"
							type="date"
							placeholder="选择入市时间"
							value-format="yyyy-MM-dd"
						/>
						<el-date-picker
							v-else
							v-model="officeProject.entry_time"
							type="month"
							placeholder="选择入市时间"
							value-format="yyyy-MM"
						/>
					</div>
				</div>
				<div v-else>
					{{ officeProject.entry_time || "--" }}
				</div>
			</el-form-item>
			<!-- 交通 -->
			<el-form-item label="交通">
				<div v-if="computedSubway.length > 0">
					<div
						v-for="(item,index) in computedSubway"
						:key="index"
					>
						<span class="line-name">
							{{ item.subway_line }}:
						</span>
						<span>{{ item.stations }}</span>
					</div>
				</div>
				<div v-else>
					--
				</div>
			</el-form-item>
			<!-- 总建筑面积 -->
			<el-form-item
				label="总建筑面积"
				prop="overall_floorage"
			>
				<div class="flex-row">
					<numberInput
						v-if="isAdd||isEdit||isDetailEdit"
						:is-decimal="true"
						:intlength="8"
						:decimallength="2"
						:value="String(officeProject.overall_floorage)"
						@update:value="officeProject.overall_floorage=$event"
					/>
					<span v-else>
						{{ officeProject.overall_floorage || "--" }}
					</span>
					<span class="area-unit">
						㎡
					</span>
				</div>
			</el-form-item>
			<!-- 总占地面积 -->
			<el-form-item
				label="总占地面积"
				prop="total_area"
			>
				<div class="flex-row">
					<numberInput
						v-if="isAdd||isEdit||isDetailEdit"
						:is-decimal="true"
						:intlength="8"
						:decimallength="2"
						:value="String(officeProject.total_area)"
						@update:value="officeProject.total_area=$event"
					/>
					<span v-else>
						{{ officeProject.total_area || "--" }}
					</span>
					<span class="area-unit">
						㎡
					</span>
				</div>
			</el-form-item>
			<!-- 供电系统 -->
			<el-form-item label="供电系统">
				<el-select
					v-if="isAdd||isEdit||isDetailEdit"
					v-model="officeProject.electric_system"
					@change="$forceUpdate()"
				>
					<el-option
						v-for="item in electric_system_options"
						:key="item.id"
						:label="item.value"
						:value="item.id+''"
					/>
				</el-select>
				<span v-else>
					{{ computedElectric[officeProject.electric_system] || "--" }}
				</span>
			</el-form-item>
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
import {
	getElectricSyctemList,
	getPriceUnitList,
	updateBuildingProjectSecond
} from "@/api/officeApi.js";
export default {
	components: {
		numberInput
	},
	data() {
		let entryValidator = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("请选择入市时间"));
			} else {
				callback();
			}
		};

		return {
			baseInfoRules: {
				entry_time: [
					{required: true, validator: entryValidator, trigger: ["blur", "change"]}
				]
			},
			electric_system_options: [],
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
		computedSubway() {
			if (this.officeProject.subway && this.officeProject.subway.length > 0) {
				let _obj = {};

				this.officeProject.subway.map(item => {
					if (_obj[item.subway_id]) {
						_obj[item.subway_id].children.push(item.station);
					} else {
						_obj[item.subway_id] = {
							subway_line: item.subway_line,
							children: [
								item.station
							]
						};
					}
				});
				let _arr = [];

				for (let key in _obj) {
					if (Object.prototype.hasOwnProperty.call(_obj, key)) {
						_arr.push({
							subway_line: _obj[key].subway_line,
							stations: _obj[key].children ? _obj[key].children.join("、") : ""
						});
					}
				}
				return _arr;
			} else {
				return [];
			}
		},
		computedElectric() {
			let _map = {};

			this.electric_system_options.forEach(item => {
				_map[item.id] = item.value;
			});
			return _map;
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
	async mounted() {
		this._getElectricSystemList();
	},
	methods: {
		changeEntryRadio() {
			this.officeProject.entry_time = "";
			this.$forceUpdate();
		},
		edit() {
			this.isDetailEdit = true;
		},
		// 取消编辑
		cancel() {
			this.isDetailEdit = false;
			this._resetFields("baseinfoForm");
			this.$emit("updateBuilding");
		},
		_resetFields(form) {
			this.$refs[form] && this.$refs[form].resetFields();
		},
		// 获取供电系统类型
		_getElectricSystemList() {
			getElectricSyctemList().then(res => {
				this.electric_system_options = res.data;
			});
		},
		// 保存第二步信息
		save() {
			this.$refs["baseinfoForm"].validate((valid) => {
				if (valid) {
					this.loading = true;
					let _data = this._generatePostData();

					_data.id = this.$route.params.id;

					updateBuildingProjectSecond(_data).then(res => {
						this.loading = false;
						this.$message.success(res.message ? res.message : "保存成功");
					}).catch(res => {
						this.loading = false;
						this.$message.error(res.message ? res.message : "保存失败");
					});
				}
			});
		},

		// 组装data
		_generatePostData() {
			let _data = {};

			_data.entry_time = this.officeProject.entry_time;
			this.officeProject.overall_floorage && (_data.overall_floorage = this.officeProject.overall_floorage);
			this.officeProject.total_area && (_data.total_area = this.officeProject.total_area);
			_data.electric_system = this.officeProject.electric_system;

			return _data;
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
	}
};
</script>

<style lang="less" scoped>
@import url(./common.less);


.area-unit {
  margin-left: 10px;
}
</style>

