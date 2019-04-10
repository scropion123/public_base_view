<template>
	<div
		v-loading="loading"
		class="baseinfo-container"
	>
		<el-form label-width="150px">
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="是否有中央空调"
				>
					<el-radio-group
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.has_central_ac"
					>
						<el-radio label="1">
							是
						</el-radio>
						<el-radio label="2">
							否
						</el-radio>
					</el-radio-group>
					<span v-else>
						{{ officeBuilding.has_central_ac=="1"?"是":"否" }}
					</span>
				</el-form-item>
				<el-form-item
					v-if="officeBuilding.has_central_ac==1"
					class="flex-1"
					label="中央空调类型"
					required=""
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.ac_type"
					>
						<el-option
							v-for="item in acTypeList"
							:key="item.id"
							:label="item.value"
							:value="item.id+''"
						/>
					</el-select>
					<span v-else>
						{{ computedACType[officeBuilding.ac_type] }}
					</span>
				</el-form-item>
			</div>
			<el-form-item
				class="flex-1"
				label="空调供应时间"
			>
				<el-select
					v-if="isAdd||isEdit||isCreate||isDetailEdit"
					v-model="officeBuilding.ac_time"
					@change="acTimeChange"
				>
					<el-option
						v-for="item in acTimeList"
						:key="item.id"
						:label="item.value"
						:value="item.id+''"
					/>
				</el-select>
				<span v-else>
					{{ computedACTime[officeBuilding.ac_time] }}
				</span>
			</el-form-item>
			<el-form-item
				v-if="officeBuilding.ac_time==2||officeBuilding.ac_time==3"
				class="flex-1"
				label="空调供应时间详情"
				required
			>
				<div v-if="isAdd||isEdit||isCreate||isDetailEdit">
					<div
						v-for="(item,index) in officeBuilding.ac_time_detail"
						:key="index"
						class="flex-row"
					>
						<div class="flex-row custome-border">
							<el-select
								v-model="officeBuilding.ac_time_detail[index].week"
								multiple
								placeholder="请选择周几，可多选"
								@change="getSelectedWeek"
							>
								<el-option
									v-for="subItem in acSupplyWeekSelect"
									:key="subItem.value"
									:label="subItem.label"
									:value="subItem.value"
									:disabled="selectedWeek.indexOf(subItem.value) != -1"
								/>
							</el-select>
							<el-time-picker
								v-model="item.time"
								class="m-l"
								is-range
								range-separator="至"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								placeholder="选择时间范围"
								value-format="HH:mm:ss"
							/>
						</div>
						<div class="row-button-container">
							<el-button
								v-if="officeBuilding.ac_time_detail.length != 1"
								type="danger"
								icon="el-icon-minus"
								circle
								@click="removeACTimeDetail(index)"
							/>
							<el-button
								v-if="index==officeBuilding.ac_time_detail.length - 1"
								type="primary"
								icon="el-icon-plus"
								circle
								@click="addACTimeDetail"
							/>
						</div>
					</div>
				</div>
				<div v-else>
					<div
						v-for="(item, index) in officeBuilding.ac_time_detail"
						:key="index"
					>
						<span class="ac-time-week">
							{{ orderWeek(item.week).join("、") }}
						</span>
						{{ item.time[0] }} ~ {{ item.time[1] }}
					</div>
				</div>
			</el-form-item>
			<!-- 空调收费情况 -->
			<el-form-item
				class="flex-1"
				label="空调收费情况"
				prop="ac_charge"
			>
				<div class="flex-row">
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="true"
						:intlength="5"
						:decimallength="2"
						:value="String(officeBuilding.ac_charge)"
						@update:value="officeBuilding.ac_charge=$event"
					/>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.ac_charge_unit"
						class="m-l"
					>
						<el-option
							value="1"
							label="元/度"
						/>
						<el-option
							value="2"
							label="元/㎡"
						/>
					</el-select>
					<div v-else>
						{{ officeBuilding.ac_charge }}{{ officeBuilding.ac_charge_unit=="1"?"元/度":"元/㎡" }}
					</div>
				</div>
			</el-form-item>
			<el-form-item
				class="flex-1"
				label="车位个数"
			>
				<div class="flex-row">
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="5"
						:value="String(officeBuilding.carport_num)"
						@update:value="officeBuilding.carport_num=$event"
					/>
					<span v-else>
						{{ officeBuilding.carport_num }}
					</span>
					<span class="item-unit">
						个
					</span>
				</div>
			</el-form-item>
			<el-form-item
				class="flex-1"
				label="车位收费情况"
			>
				<textAreaComponent
					v-if="isAdd||isEdit||isCreate||isDetailEdit"
					:value="officeBuilding.carport_fee_situation"
					:maxlength="200"
					@update:value="officeBuilding.carport_fee_situation=$event"
				/>
				<span v-else>
					{{ officeBuilding.carport_fee_situation }}
				</span>
			</el-form-item>
		</el-form>
		<div
			v-if="officeProject.is_administrator || isCreate"
			class="button-container"
		>
			<el-button
				v-if="isDetailEdit"
				type="danger"
				@click="cancelEdit"
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
import textAreaComponent from "@/components/textarea_with_count.vue";
import {
	saveBuilding
} from "@/api/officeApi.js";
export default {
	components: {
		numberInput,
		textAreaComponent
	},
	props: {
		isCreate: {
			type: Boolean,
			default: false
		},
		acTypeList: Array,
		acTimeList: Array,
		index: Number
	},
	data() {
		return {
			loading: false,
			isAdd: false,
			isDetail: false,
			isEdit: false,
			// 详情状态下点击编辑
			isDetailEdit: false,
			acSupplyWeekSelect: [
				{label: "周一", value: "1", disabled: false},
				{label: "周二", value: "2", disabled: false},
				{label: "周三", value: "3", disabled: false},
				{label: "周四", value: "4", disabled: false},
				{label: "周五", value: "5", disabled: false},
				{label: "周六", value: "6", disabled: false},
				{label: "周日", value: "7", disabled: false}
			],
			acSupplyWeekMap: {
				1: "周一",
				2: "周二",
				3: "周三",
				4: "周四",
				5: "周五",
				6: "周六",
				7: "周日",
			},
			selectedWeek: [],
		};
	},
	computed: {
		officeProject() {
			return this.$store.getters.officeProject;
		},
		officeBuilding() {
			return this.$store.getters.officeBuilding[this.index];
		},
		computedACType() {
			let _obj = [];

			if (this.acTypeList && this.acTypeList.length > 0) {
				this.acTypeList.forEach(item => {
					_obj[item.id] = item.value;
				});
			}
			return _obj;
		},
		computedACTime() {
			let _obj = [];

			if (this.acTimeList && this.acTimeList.length > 0) {
				this.acTimeList.forEach(item => {
					_obj[item.id] = item.value;
				});
			}
			return _obj;
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
		removeACTimeDetail(index) {
			this.officeBuilding.ac_time_detail.splice(index, 1);
		},
		addACTimeDetail() {
			this.officeBuilding.ac_time_detail.push({
				week: [],
				time: ["09:00:00", "18:00:00"]
			});
		},
		// 编辑
		edit() {
			this.isView = false;
			this.isEdit = true;
			this.isAdd = false;
			this.isDetailEdit = true;
		},
		cancelEdit() {
			this.isDetailEdit = false;
			this.isView = true;
			this.isEdit = false;
			this.isAdd = false;
		},
		// 修改空调供应时间
		acTimeChange(val) {
			if (val == 2 || val == 3) {
				if (!this.officeBuilding.ac_time_detail || this.officeBuilding.ac_time_detail.length == 0) {
					this.officeBuilding.ac_time_detail = [
						{week: [], time: ["09:00:00", "18:00:00"]}
					];
				}
			}
		},
		// 获取已选空调供应时间
		getSelectedWeek() {
			let _arr = [];

			this.officeBuilding.ac_time_detail.forEach(item => {
				_arr.push(...item.week);
			});
			this.selectedWeek = _arr;
		},

		// 获取表单数据
		_getPostData() {
			let _data = {
				project_id: this.$route.params.id,
				id: this.officeBuilding.id,
				step: 5,
				has_central_ac: this.officeBuilding.has_central_ac,
				ac_time: this.officeBuilding.ac_time,
			};

			if (_data.has_central_ac == "1") {
				_data.ac_type = this.officeBuilding.ac_type;
			}

			if (_data.ac_time == 2 || _data.ac_time == 3) {
				_data.ac_time_detail = this.officeBuilding.ac_time_detail;
			}
			this.officeBuilding.ac_charge && (_data.ac_charge = this.officeBuilding.ac_charge);
			this.officeBuilding.ac_charge_unit && (_data.ac_charge_unit = this.officeBuilding.ac_charge_unit);
			// carport_num
			this.officeBuilding.carport_num && (_data.carport_num = this.officeBuilding.carport_num);
			this.officeBuilding.carport_fee_situation && (_data.carport_fee_situation = this.officeBuilding.carport_fee_situation);

			return _data;
		},

		save() {
			if (!this.officeBuilding.has_central_ac || this.officeBuilding.has_central_ac == "0") {
				this.$message.error("请选择是否有中央空调");
				return;
			}
			if (this.officeBuilding.has_central_ac == "1" && (!this.officeBuilding.ac_type || this.officeBuilding.ac_type == "0")) {
				this.$message.error("请选择中央空调类型");
				return;
			}
			if (this.officeBuilding.ac_time == 2 || this.officeBuilding.ac_time == 3) {
				if (!this.officeBuilding.ac_time_detail || this.officeBuilding.ac_time_detail.length == 0) {
					this.$message.error("请填写空调供应时间详情");
					return;
				}

				for (let i = 0, _len = this.officeBuilding.ac_time_detail.length; i < _len; i++) {
					let _item = this.officeBuilding.ac_time_detail[i];

					if (!_item.week || _item.week.length == 0) {
						this.$message.error("请选择空调供应时间");
						return;
					}
					if (!_item.time || _item.time.length == 0) {
						this.$message.error("请选择空调供应起止时间");
						return;
					}
				}
			}

			if (this.officeBuilding.ac_charge && !this.officeBuilding.ac_charge_unit) {
				this.$message.error("请选择空调收费单位");
				return;
			}
			if (!this.officeBuilding.ac_charge && this.officeBuilding.ac_charge_unit) {
				this.$message.error("请填写空调收费价格");
				return;
			}

			let _data = this._getPostData();

			this.loading = true;

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
		},

		// 空调时间排序
		orderWeek(week) {
			if (!week || week.length == 0) {
				return [];
			} else {
				let _arr = [];

				for (let j = 0, _len1 = this.acSupplyWeekSelect.length; j < _len1; j++) {
					for (let i = 0, _len = week.length; i < _len; i++) {
						if (week[i] == this.acSupplyWeekSelect[j].value) {
							_arr.push(this.acSupplyWeekSelect[j].label);
							continue;
						}
					}
				}
				return _arr;
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url(./common.less);
.m-l {
  margin-left: 10px;
}
.ac-time-week {
	margin-right: 10px;
}
</style>