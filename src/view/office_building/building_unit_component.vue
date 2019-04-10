<template>
	<div>
		<el-form
			ref="officeBuildingForm"
			:model="officeBuilding"
			label-width="100px"
		>
			<el-form-item
				v-for="(item, index) in officeBuilding.unit_list"
				:key="index"
				label="单元号"
				:prop="'unit_list.' + index + '.unit'"
			>
				<div v-if="isAdd || isEdit || isDetailEdit">
					<el-input v-model="officeBuilding.unit_list[index].unit" />
				</div>
				<div v-else>
					{{ officeBuilding.unit_list[index].unit }}
				</div>
			</el-form-item>
			<el-form-item
				v-for="(item, index) in officeBuilding.new_unit_list"
				:key="index"
				label="单元号"
				:prop="'new_unit_list.' + index + '.unit'"
			>
				<div class="flex-row">
					<el-input v-model="officeBuilding.new_unit_list[index].unit" />
				</div>
			</el-form-item>
		</el-form>
		<div class="flex-row-center">
			<el-button
				type="primary"
				icon="el-icon-plus"
				circle
				@click="addUnit(-1)"
			/>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		isCreate: {
			type: Boolean,
			default: false
		},
		index: Number,
	},
	data() {
		return {
			isAdd: false,
			isEdit: false,
			isDetail: false,
			isDetailEdit: false
		};
	},
	computed: {
		officeProject() {
			return this.$store.getters.officeProject;
		},
		officeBuilding() {
			let _officeBuilding = this.$store.getters.officeBuilding[this.index];

			_officeBuilding.new_unit_list = [];
			return _officeBuilding;
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
		addUnit() {
			if (this.$refs["officeBuildingForm"]) {
				this.$refs["officeBuildingForm"].validate((valid) => {
					if (valid) {
						this.officeBuilding.new_unit_list.push({
							unit: ""
						});
						this.$forceUpdate();
						console.log(this.officeBuilding.new_unit_list);
					}
				});
			} else {
				this.officeBuilding.new_unit_list.push({});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.flex-row {
  display: flex;
}
.flex-row-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.row-button-container {
  margin-left: 10px;
}
</style>

