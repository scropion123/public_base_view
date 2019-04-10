<template>
	<div class="wrapper">
		<page-title title="商圈详情" />
		<div class="content">
			<div class="detail-btn-box">
				<router-link to="/base/business/list">
					<el-button
						class="backBtn"
						size="medium"
					>
						返 回
					</el-button>
				</router-link>
				<router-link
					v-if="businessDetailData.is_administrator"
					:to="&quot;/base/business/add/&quot;+businessId"
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
						<span>行政区域：</span>
						<span>{{ businessDetailData.province }}{{ businessDetailData.city }}{{ businessDetailData.district }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>商圈名称：</span>
						<span>{{ businessDetailData.business_area_name }}</span>
					</div>
				</el-col>
				<el-col :span="24">
					<div class="detail-item">
						<span>区域范围：</span>
						<baidu-map
							:center="businessDetailData.finalCenterPoint"
							:zoom="zoom"
							:scroll-wheel-zoom="true"
							class="bm-view"
							@ready="handler"
						>
							<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
							<bm-marker
								:position="businessDetailData.finalCenterPoint"
								:dragging="true"
								animation="BMAP_ANIMATION_BOUNCE"
							/>
							<bm-polygon
								:path="businessDetailData.polygonAfterDraw"
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
			:id="businessId"
			:type="5"
		/>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import record from "@/components/operation_record.vue";
import {
	businessDetail,
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
			businessId: this.$route.params.id,
			businessDetailData: {
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
				this.zoom = 15;
				businessDetail({id: this.businessId}).then(res => {
					this.businessDetailData = res.data;
					this.businessDetailData.finalCenterPoint = {lng: Number(res.data.longitude), lat: Number(res.data.latitude)};
					this.businessDetailData.polygonAfterDraw = res.data.bound;
					if (this.businessDetailData.city_code) {
						for (let item of this.directlyCity) {
							if (this.businessDetailData.province_code == item) {
								this.businessDetailData.province = "";
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