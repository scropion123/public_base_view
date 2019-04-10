<template>
	<div class="wrapper">
		<page-title title="行政区域详情" />
		<div class="content">
			<div class="detail-btn-box">
				<router-link to="/base/area/list">
					<el-button
						class="backBtn"
						size="medium"
					>
						返 回
					</el-button>
				</router-link>
				<router-link
					v-if="areaDetailData.is_administrator"
					:to="&quot;/base/area/add/&quot;+areaId"
				>
					<el-button
						type="primary"
						size="medium"
					>
						编 辑
					</el-button>
				</router-link>
			</div>
			<el-row :gutter="20">
				<el-col :span="12">
					<div class="detail-item">
						<span>区域级别：</span>
						<span v-if="areaDetailData.official_level == 1">
							省
						</span>
						<span v-else-if="areaDetailData.official_level == 2">
							市
						</span>
						<span v-else-if="areaDetailData.official_level == 3">
							区
						</span>
					</div>
				</el-col>
				<el-col
					v-if="areaDetailData.official_level > 1"
					:span="12"
				>
					<div
						v-if="areaDetailData.official_level == 2"
						class="detail-item"
					>
						<span>对应省：</span>
						<span>{{ areaDetailData.province }}</span>
					</div>
					<div
						v-if="areaDetailData.official_level == 3"
						class="detail-item"
					>
						<span>对应省、市：</span>
						<span>{{ areaDetailData.province }}{{ areaDetailData.city }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>区域名称：</span>
						<span v-if="areaDetailData.official_level == 1">
							{{ areaDetailData.province }}
						</span>
						<span v-else-if="areaDetailData.official_level == 2">
							{{ areaDetailData.city }}
						</span>
						<span v-else-if="areaDetailData.official_level == 3">
							{{ areaDetailData.district }}
						</span>
					</div>
				</el-col>
				<el-col
					v-if="areaDetailData.official_level > 1"
					:span="12"
				>
					<div class="detail-item">
						<span>拼音：</span>
						<span>{{ areaDetailData.pinyin }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>行政代码：</span>
						<span v-if="areaDetailData.official_level == 1">
							{{ areaDetailData.province_code }}
						</span>
						<span v-else-if="areaDetailData.official_level == 2">
							{{ areaDetailData.city_code }}
						</span>
						<span v-else-if="areaDetailData.official_level == 3">
							{{ areaDetailData.district_code }}
						</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div
						v-if="areaDetailData.code_self>0"
						class="detail-item"
					>
						<span>行政代码是否自编：</span>
						<span>{{ areaDetailData.code_self == 1 ? '是' : '否' }}</span>
					</div>
				</el-col>
				<el-col :span="24">
					<div class="detail-item">
						<span>区域范围：</span>
						<baidu-map
							:center="areaDetailData.finalCenterPoint"
							:zoom="zoom"
							:scroll-wheel-zoom="true"
							class="bm-view"
							@ready="handler"
						>
							<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
							<bm-marker
								:position="areaDetailData.finalCenterPoint"
								:dragging="true"
								animation="BMAP_ANIMATION_BOUNCE"
							/>
							<bm-polygon
								:path="areaDetailData.polygonAfterDraw"
								stroke-color="blue"
								:stroke-opacity="0.5"
								:stroke-weight="2"
								:editing="false"
							/>
						</baidu-map>
					</div>
				</el-col>
			</el-row>
		</div>
		<record
			:id="areaId"
			:type="6"
		/>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import record from "@/components/operation_record.vue";
import {
	areaDetail,
} from "@/api/api";
export default {
	components: {
		pageTitle,
		record,
	},
	data() {
		return {
			map: null,
			BMap: null,
			zoom: 3,
			areaId: this.$route.params.id,
			areaDetailData: {
				finalCenterPoint: {lng: 116.404, lat: 39.915},
				polygonAfterDraw: [],
			},
			directlyCity: ["110000", "310000", "500000", "120000"],
		};
	},
	created() {
	},
	methods: {
		handler({BMap, map}) {
			return new Promise(() => {
				this.map = map;
				this.BMap = BMap;
				this.zoom = 10;
				// 初始地图后获取行政区详情
				areaDetail({id: this.areaId}).then(res => {
					this.areaDetailData = res.data;
					this.areaDetailData.finalCenterPoint = {lng: Number(res.data.longitude), lat: Number(res.data.latitude)};
					this.areaDetailData.polygonAfterDraw = res.data.bound;
					if (this.areaDetailData.city_code) {
						for (let item of this.directlyCity) {
							if (this.areaDetailData.province_code == item) {
								this.areaDetailData.province = "";
							}
						}
					}
				}).catch(err => {
					this.$message({
						message: err.message,
						type: "error"
					});
				});
			});
		},
	},
};
</script>

<style scoped lang="less">
</style>