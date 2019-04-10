<template>
	<div class="wrapper">
		<page-title :title="(areaId==0?&quot;新增&quot;:&quot;编辑&quot;)+&quot;区域&quot;" />
		<div class="content">
			<el-form
				ref="addForm"
				:model="addForm"
				:rules="rules"
				label-width="130px"
			>
				<el-form-item
					label="区域级别"
					prop="official_level"
				>
					<el-radio-group
						v-model="addForm.official_level"
						:disabled="areaId>0"
					>
						<el-radio label="1">
							省
						</el-radio>
						<el-radio label="2">
							市
						</el-radio>
						<el-radio label="3">
							区
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					v-if="addForm.official_level == 2"
					label="省"
					prop="addProvince"
				>
					<el-select
						v-model="addForm.addProvince"
						placeholder="请选择省"
					>
						<el-option
							v-for="item in provinceList"
							:key="item.label"
							:label="item.value"
							:value="item.label"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					v-if="addForm.official_level == 3"
					label="省、市"
					prop="addProvinceCityListSelected"
				>
					<el-cascader
						v-model="addForm.addProvinceCityListSelected"
						placeholder="请选择省、市"
						clearable
						:options="provinceCityList"
						change-on-select
					/>
				</el-form-item>
				<div
					v-for="(item,index) in addForm.regionalisms"
					:key="index"
				>
					<el-form-item
						label="名称"
						:prop="'regionalisms.'+index+'.name'"
						placeholder="请输入名称"
						:rules="[
							{ required: true, message: '请输入名称', trigger: 'blur' },
							{ max: addForm.official_level == 1 ? 10 : addForm.official_level == 2 ? 20 : 25, message: ''+(addForm.official_level == 1 ? 10 : (addForm.official_level == 2 ? 20 : 25)) +'字内', trigger: 'blur' }
						]"
					>
						<el-input v-model="item.name" />
					</el-form-item>
					<el-form-item
						v-if="addForm.official_level != 1"
						label="拼音"
						placeholder="请输入拼音"
						:prop="'regionalisms.'+index+'.pinyin'"
						:rules="[
							{ required: true, message: '请输入拼音', trigger: 'blur' },
							{ max: addForm.official_level == 1 ? 10 : addForm.official_level == 2 ? 20 : 25, message: ''+(addForm.official_level == 1 ? 10 : (addForm.official_level == 2 ? 20 : 25)) +'字内', trigger: 'blur' },
							{ pattern: /[a-zA-Z]/, message: '请输入字母', trigger: 'blur' },
						]"
					>
						<el-input v-model="item.pinyin" />
					</el-form-item>
					<el-form-item
						label="行政代码"
						placeholder="请输入行政编码"
						:prop="'regionalisms.'+index+'.postal_code'"
						:rules="[
							{ required: true, message: '请输入行政编码', trigger: 'blur' },
							{ pattern: /^\d{6}\b/, message: '必须为6位数字', trigger: 'blur' },
						]"
					>
						<el-input
							v-model.number="item.postal_code"
							maxlength="6"
						/>
					</el-form-item>
					<el-form-item
						label="是否自编"
						:prop="'regionalisms.'+index+'.code_self'"
					>
						<el-radio-group v-model="item.code_self">
							<el-radio label="1">
								是
							</el-radio>
							<el-radio label="2">
								否
							</el-radio>
						</el-radio-group>
					</el-form-item>
					<baiduMap
						:id="areaId"
						:data="item"
						:index="index"
						:type="1"
						@updateData="getUpdateData"
					/>
					<el-form-item
						v-if="areaId==0"
						style="text-align: right;"
					>
						<el-button
							v-if="index == addForm.regionalisms.length - 1 && index != 0"
							type="danger"
							icon="el-icon-minus"
							size="small"
							circle
							@click="reduceItem(index)"
						/>
						<el-button
							v-if="index == addForm.regionalisms.length - 1"
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
				<el-button @click="goBack()">
					返 回
				</el-button>
				<el-button
					type="primary"
					@click="areaAddSubmit('addForm')"
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
	getProvinceCityList, getProvinceList, areaAddSubmit, areaDetail, areaEditSubmit,
} from "@/api/api";
export default {
	components: {
		pageTitle,
		baiduMap,
	},
	data() {
		return {
			areaId: this.$route.params.id,
			provinceList: [],
			provinceCityList: [],
			addForm: {
				official_level: "1",
				addProvince: "",
				addProvinceCityListSelected: [],
				regionalisms: [{
					i: 0,
					name: "",
					pinyin: "",
					postal_code: "",
					code_self: "",
					finalCenterPoint: {},
					// 存储画出折线点的数组
					polyPointArray: [],
					// 画圈完成后生成的多边形
					polygonAfterDraw: [],
				}],
			},
			rules: {
				province: [
					{required: true, message: "请输入省名称", trigger: "blur"},
					{max: 10, message: "10字内", trigger: "blur"}
				],
				city: [
					{required: true, message: "请输入市名称", trigger: "blur"},
					{max: 20, message: "20字内", trigger: "blur"}
				],
				district: [
					{required: true, message: "请输入区名称", trigger: "blur"},
					{max: 25, message: "25字内", trigger: "blur"}
				],
				pinyin: [
					{required: true, message: "请输入拼音", trigger: "blur"},
					{max: 20, message: "20字内", trigger: "blur"}
				],
				official_level: [
					{required: true, message: "请选择区域级别", trigger: "change"}
				],
				addProvince: [
					{required: true, message: "请选择省", trigger: "change"}
				],
				addProvinceCityListSelected: [
					{required: true, message: "请选择省市", trigger: "change"}
				]
			}
		};
	},
	created() {
		this.getProvinceCityList();
		this.getProvinceList();
		if (this.areaId > 0) {
			this.getAreaDetail();
		}
	},
	methods: {
		getProvinceCityList() {
			getProvinceCityList({}).then(res => {
				this.provinceCityList = res.data;
			});
		},
		getProvinceList() {
			getProvinceList({}).then(res => {
				this.provinceList = res.data;
			});
		},
		// 获取子组件数据
		getUpdateData(e) {
			let newData = e;

			this.addForm.regionalisms[newData.i] = newData;
		},
		// 获取行政区详情
		getAreaDetail() {
			areaDetail({id: this.areaId}).then(res => {
				let areaDetailData = res.data;

				this.addForm.official_level = areaDetailData.official_level;
				if (areaDetailData.official_level == 2) {
					this.addForm.addProvince = areaDetailData.province_code;
				} else if (areaDetailData.official_level == 3) {
					this.addForm.addProvinceCityListSelected = [areaDetailData.province_code, areaDetailData.city_code];
				}
				this.addForm.regionalisms = [];
				this.addForm.regionalisms.push({
					i: 0,
					name: areaDetailData.official_level == 1 ? areaDetailData.province : (areaDetailData.official_level == 2 ? areaDetailData.city : areaDetailData.district),
					pinyin: areaDetailData.pinyin,
					postal_code: areaDetailData.official_level == 1 ? areaDetailData.province_code : (areaDetailData.official_level == 2 ? areaDetailData.city_code : areaDetailData.district_code),
					code_self: areaDetailData.code_self,
					finalCenterPoint: {
						lng: areaDetailData.longitude ? Number(areaDetailData.longitude) : 116.404,
						lat: areaDetailData.latitude ? Number(areaDetailData.latitude) : 39.915,
					},
					// 存储画出折线点的数组
					polyPointArray: areaDetailData.bound ? areaDetailData.bound : [],
					// 画圈完成后生成的多边形
					polygonAfterDraw: areaDetailData.bound ? areaDetailData.bound : [],
				});
			});
		},
		addItem(index) {
			this.addForm.regionalisms.push({
				i: index + 1,
				name: "",
				pinyin: "",
				postal_code: "",
				code_self: "",
				finalCenterPoint: {},
				polyPointArray: [],
				polygonAfterDraw: [],
			});
		},
		reduceItem(index) {
			this.addForm.regionalisms.splice(index, 1);
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		// 验证是否有选择中心点区域范围
		hasArea() {
			let hasArea = true;

			for (let i = 0, len = this.addForm.regionalisms.length; i < len; i++) {
				let data = this.addForm.regionalisms[i];

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
		areaAddSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let regionalisms = [];

					if (!this.hasArea()) {
						return false;
					} else {
						if (this.addForm.official_level == 1) {
							for (let i = 0, len = this.addForm.regionalisms.length; i < len; i++) {
								regionalisms.push({
									province: this.addForm.regionalisms[i].name,
									province_code: this.addForm.regionalisms[i].postal_code,
									code_self: this.addForm.regionalisms[i].code_self,
									longitude: this.addForm.regionalisms[i].finalCenterPoint.lng,
									latitude: this.addForm.regionalisms[i].finalCenterPoint.lat,
									bound: this.addForm.regionalisms[i].polygonAfterDraw,
								});
							}
						}
						if (this.addForm.official_level == 2) {
							for (let i = 0, len = this.addForm.regionalisms.length; i < len; i++) {
								regionalisms.push({
									province_code: this.addForm.addProvince,
									city: this.addForm.regionalisms[i].name,
									city_code: this.addForm.regionalisms[i].postal_code,
									pinyin: this.addForm.regionalisms[i].pinyin,
									code_self: this.addForm.regionalisms[i].code_self,
									longitude: this.addForm.regionalisms[i].finalCenterPoint.lng,
									latitude: this.addForm.regionalisms[i].finalCenterPoint.lat,
									bound: this.addForm.regionalisms[i].polygonAfterDraw,
								});
							}
						}
						if (this.addForm.official_level == 3) {
							for (let i = 0, len = this.addForm.regionalisms.length; i < len; i++) {
								regionalisms.push({
									province_code: this.addForm.addProvinceCityListSelected[0],
									city_code: this.addForm.addProvinceCityListSelected[1],
									district: this.addForm.regionalisms[i].name,
									district_code: this.addForm.regionalisms[i].postal_code,
									pinyin: this.addForm.regionalisms[i].pinyin,
									code_self: this.addForm.regionalisms[i].code_self,
									longitude: this.addForm.regionalisms[i].finalCenterPoint.lng,
									latitude: this.addForm.regionalisms[i].finalCenterPoint.lat,
									bound: this.addForm.regionalisms[i].polygonAfterDraw,
								});
							}
						}
						if (this.areaId == 0) {
							let params = {
								official_level: this.addForm.official_level,
								regionalisms: regionalisms
							};

							this.add(params);
						} else {
							let params = regionalisms[0];

							params.official_level = this.addForm.official_level;
							params.id = this.areaId;
							this.edit(params);
						}
					}
				} else {
					return false;
				}
			});
		},
		add(params) {
			areaAddSubmit(params).then(res => {
				// this.resetForm("addForm");
				// this.addForm.regionalisms = [
				// 	{
				// 		i: 0,
				// 		name: "",
				// 		pinyin: "",
				// 		postal_code: "",
				// 		code_self: "",
				// 		finalCenterPoint: {},
				// 		polyPointArray: [],
				// 		polygonAfterDraw: [],
				// 	}
				// ];
				this.$message({
					message: res.message,
					type: "success"
				});
				this.$router.push("/base/area/list");
				// if (params.official_level == 1) {
				// 	this.getProvinceList();
				// } else if (params.official_level == 2) {
				// 	this.getProvinceCityList();
				// }
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
		edit(params) {
			areaEditSubmit(params).then(res => {
				this.$message({
					message: res.message,
					type: "success"
				});
				this.$router.push("/base/area/detail/" + this.areaId);
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
		goBack() {
			this.$router.push("/base/area/list");
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