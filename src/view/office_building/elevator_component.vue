<template>
	<div
		v-loading="loading"
		class="baseinfo-container"
	>
		<el-form
			ref="officeBuilding"
			label-width="100px"
			:model="officeBuilding"
			:rules="rule"
		>
			<el-form-item
				label="电梯品牌"
				prop="elevator_brand"
			>
				<el-input
					v-if="isAdd||isEdit||isCreate||isDetailEdit"
					v-model="officeBuilding.elevator_brand"
					maxlength="10"
					placeholder="10个字以内"
				/>
				<span v-else>
					{{ officeBuilding.elevator_brand }}
				</span>
			</el-form-item>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="客梯数"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="2"
						:value="String(officeBuilding.elevator_count)"
						@update:value="officeBuilding.elevator_count=$event"
					/>
					<span v-else>
						{{ officeBuilding.elevator_count }}
					</span>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="货梯数"
				>
					<numberInput
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						:is-decimal="false"
						:intlength="2"
						:value="String(officeBuilding.good_elevator_count)"
						@update:value="officeBuilding.good_elevator_count=$event"
					/>
					<span v-else>
						{{ officeBuilding.good_elevator_count }}
					</span>
				</el-form-item>
			</div>
			<div class="flex-row">
				<el-form-item
					class="flex-1"
					label="高低分区"
					prop="elevator_divide_floor"
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.elevator_divide_floor"
					>
						<el-option
							label="是"
							value="1"
						/>
						<el-option
							label="否"
							value="2"
						/>
					</el-select>
					<span v-else>
						{{ officeBuilding.elevator_divide_floor == "1" ? "是":"否" }}
					</span>
				</el-form-item>
				<el-form-item
					class="flex-1"
					label="电梯速度"
					prop="elevator_speed"
				>
					<el-select
						v-if="isAdd||isEdit||isCreate||isDetailEdit"
						v-model="officeBuilding.elevator_speed"
					>
						<el-option
							label="高速"
							value="1"
						/>
						<el-option
							label="低速"
							value="2"
						/>
					</el-select>
					<span v-else>
						<span v-if="officeBuilding.elevator_speed == 1">
							高速
						</span>
						<span v-else-if="officeBuilding.elevator_speed == 2">
							低速
						</span>
						<span v-else>
							--
						</span>
					</span>
				</el-form-item>
			</div>
			<el-form-item
				label="货梯尺寸"
				prop="good_size"
			>
				<el-select
					v-if="isAdd||isEdit||isCreate||isDetailEdit"
					v-model="officeBuilding.good_size"
					class="good-size-select"
				>
					<el-option
						v-for="item in goodSizeList"
						:key="item.id"
						:label="item.value"
						:value="item.id+''"
					/>
				</el-select>
				<span v-else>
					{{ computedGoodSizeMap[officeBuilding.good_size] && computedGoodSizeMap[officeBuilding.good_size].value }}
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
import {
	saveBuilding
} from "@/api/officeApi.js";
import numberInput from "@/components/input_component.vue";
export default {
	components: {
		numberInput
	},
	props: {
		isCreate: {
			type: Boolean,
			default: false
		},
		index: Number,
		goodSizeList: Array
	},
	data() {
		let _checkDivide = (rule, value, callback) => {
			if (!value || value == "0") {
				return callback(new Error("请选择是否高低分区"));
			} else {
				callback();
			}
		};


		return {
			loading: false,
			isAdd: false,
			isDetail: false,
			isEdit: false,
			isDetailEdit: false,
			rule: {
				elevator_brand: [
					{required: true, message: "请填写电梯品牌", trigger: ["blur", "change"]}
				],
				elevator_divide_floor: [
					{required: true, validator: _checkDivide, trigger: ["blur", "change"]}
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
		computedGoodSizeMap() {
			let _obj = [];

			if (this.goodSizeList && this.goodSizeList.length > 0) {
				this.goodSizeList.forEach(item => {
					_obj[item.id] = item;
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
		edit() {
			this.isDetailEdit = true;
		},
		cancel() {
			this.isDetailEdit = false;
			this.$emit("updateOfficeBuilding");
		},
		// 保存
		save() {
			this.$refs["officeBuilding"].validate((valid) => {
				if (valid) {
					this.loading = true;
					let _data = {
						project_id: this.$route.params.id,
						step: 4,
						id: this.officeBuilding.id,
						elevator_brand: this.officeBuilding.elevator_brand,
						elevator_speed: this.officeBuilding.elevator_speed,
						elevator_divide_floor: this.officeBuilding.elevator_divide_floor,
					};

					this.officeBuilding.elevator_count && (_data.elevator_count = this.officeBuilding.elevator_count);
					this.officeBuilding.good_elevator_count && (_data.good_elevator_count = this.officeBuilding.good_elevator_count);
					this.officeBuilding.good_size && (_data.good_size = this.officeBuilding.good_size);
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
		}
	}
};
</script>
<style lang="less" scoped>
@import url(./common.less);
.good-size-select {
  width: 100%;
}
</style>