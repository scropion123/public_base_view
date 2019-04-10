<template>
	<div class="wrapper">
		<page-title :title="(businessId==0?&quot;新增&quot;:&quot;编辑&quot;)+&quot;商圈&quot;" />
		<div class="content">
			<el-form
				ref="addForm"
				:model="addForm"
				:rules="rules"
				label-width="130px"
			>
				<el-form-item
					label="行政区"
					prop="addProvinceCityListSelected"
				>
					<el-cascader
						v-model="addForm.addProvinceCityListSelected"
						placeholder="请选择行政区"
						clearable
						:options="addProvinceCityList"
					/>
				</el-form-item>
				<div
					v-for="(item,index) in addForm.business_area_names"
					:key="index"
				>
					<el-form-item
						label="名称"
						:prop="'business_area_names.'+index+'.name'"
						placeholder="请输入商圈名"
						:rules="[
							{ required: true, message: '请输入商圈名', trigger: 'blur' },
							{ max: 30, message: '30字内', trigger: 'blur' }
						]"
					>
						<el-input v-model="item.name" />
					</el-form-item>
					<baiduMap
						:data="item"
						:index="index"
						:id="businessId"
						:type="2"
						@updateData="getUpdateData"
					/>
					<el-form-item
						v-if="businessId==0"
						style="text-align: right;"
					>
						<el-button
							v-if="index == addForm.business_area_names.length - 1 && index != 0"
							type="danger"
							icon="el-icon-minus"
							size="small"
							circle
							@click="reduceItem(index)"
						/>
						<el-button
							v-if="index == addForm.business_area_names.length - 1"
							type="primary"
							icon="el-icon-plus"
							size="small"
							circle
							@click="addItem(index)"
						/>
					</el-form-item>
				</div>
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
					@click="businessAddSubmit('addForm')"
				>
					确 定
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import baiduMap from "@/components/map.vue";
import {
	getDicAreaCode, businessAddSubmit, businessDetail, businessEditSubmit,
} from "@/api/api";
export default {
	components: {
		pageTitle,
		baiduMap,
	},
	data() {
		return {
			businessId: this.$route.params.id,
			addProvinceCityList: [],
			addForm: {
				addProvinceCityListSelected: [],
				business_area_names: [{
					i: 0,
					name: "",
					finalCenterPoint: {},
					// 存储画出折线点的数组
					polyPointArray: [],
					// 画圈完成后生成的多边形
					polygonAfterDraw: [],
				}],
			},
			rules: {
				business_area_name: [
					{required: true, message: "请输入省名称", trigger: "blur"},
					{max: 30, message: "30字内", trigger: "blur"}
				],
				addProvinceCityListSelected: [
					{required: true, message: "请选择行政区", trigger: "change"}
				]
			}
		};
	},
	created() {
		this.getProvinceCityDistrict();
		if (this.businessId > 0) {
			this.getBusinessDetail();
		}
	},
	methods: {
		getProvinceCityDistrict() {
			getDicAreaCode({}).then(res => {
				this.addProvinceCityList = res.data;
			});
		},
		// 获取子组件数据
		getUpdateData(e) {
			let newData = e;

			this.addForm.business_area_names[newData.i] = newData;
		},
		// 获取商圈详情
		getBusinessDetail() {
			businessDetail({id: this.businessId}).then(res => {
				let businessDetailData = res.data;

				this.addForm.addProvinceCityListSelected = [businessDetailData.province_code, businessDetailData.city_code, businessDetailData.district_code];
				this.addForm.business_area_names = [];
				this.addForm.business_area_names.push({
					i: 0,
					name: businessDetailData.business_area_name,
					finalCenterPoint: {
						lng: businessDetailData.longitude ? Number(businessDetailData.longitude) : 116.404,
						lat: businessDetailData.latitude ? Number(businessDetailData.latitude) : 39.915,
					},
					// 存储画出折线点的数组
					polyPointArray: businessDetailData.bound ? businessDetailData.bound : [],
					// 画圈完成后生成的多边形
					polygonAfterDraw: businessDetailData.bound ? businessDetailData.bound : [],
				});
			});
		},
		addItem(index) {
			this.addForm.business_area_names.push({
				i: index + 1,
				name: "",
				finalCenterPoint: {},
				polyPointArray: [],
				polygonAfterDraw: [],
			});
		},
		reduceItem(index) {
			this.addForm.business_area_names.splice(index, 1);
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		// 验证是否有选择中心点区域范围
		hasArea() {
			let hasArea = true;

			for (let i = 0, len = this.addForm.business_area_names.length; i < len; i++) {
				let data = this.addForm.business_area_names[i];

				if (!data.finalCenterPoint.lng || !data.finalCenterPoint.lat) {
					this.$message({
						message: "请选择第" + (i + 1) + "项中心点！",
						type: "warning"
					});
					hasArea = false;
				} else if (data.polygonAfterDraw.length == 0) {
					this.$message({
						message: "请选择第" + (i + 1) + "项区域范围！",
						type: "warning"
					});
					hasArea = false;
				} else {
					hasArea = true;
				}
			}
			return hasArea;
		},
		// 提交数据
		businessAddSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let business_area_names = [];

					if (!this.hasArea()) {
						return false;
					} else {
						for (let i = 0, len = this.addForm.business_area_names.length; i < len; i++) {
							business_area_names.push({
								business_area_name: this.addForm.business_area_names[i].name,
								longitude: this.addForm.business_area_names[i].finalCenterPoint.lng,
								latitude: this.addForm.business_area_names[i].finalCenterPoint.lat,
								bound: this.addForm.business_area_names[i].polygonAfterDraw,
							});
						}

						if (this.businessId == 0) {
							let params = {
								province_code: this.addForm.addProvinceCityListSelected[0],
								city_code: this.addForm.addProvinceCityListSelected[1],
								district_code: this.addForm.addProvinceCityListSelected[2],
								business_area_list: business_area_names
							};

							this.add(params);
						} else {
							let params = business_area_names[0];

							params.province_code = this.addForm.addProvinceCityListSelected[0],
							params.city_code = this.addForm.addProvinceCityListSelected[1];
							params.district_code = this.addForm.addProvinceCityListSelected[2];
							params.id = this.businessId;
							this.edit(params);
						}
					}
				} else {
					return false;
				}
			});
		},
		add(params) {
			businessAddSubmit(params).then(res => {
				this.$message({
					message: res.message,
					type: "success"
				});
				this.$router.push("/base/business/list");
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
		edit(params) {
			businessEditSubmit(params).then(res => {
				this.$message({
					message: res.message,
					type: "success"
				});
				this.$router.push("/base/business/detail/" + this.businessId);
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
		goBack() {
			this.$router.push("/base/business/list");
		},
	},
};
</script>

<style scoped lang="less">
.content {
	padding: 0 100px;
}
.btn-group {
    text-align: center;
}
</style>