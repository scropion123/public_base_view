<template>
	<div class="wrapper">
		<page-title title="门店详情" />
		<div class="content">
			<div class="detail-btn-box">
				<router-link to="/opt/store/list">
					<el-button
						class="backBtn"
						size="medium"
					>
						返 回
					</el-button>
				</router-link>
				<router-link
					v-if="storeDetailData.is_administrator"
					:to="&quot;/opt/store/add/&quot;+storeId"
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
						<span>所属运营商：</span>
						<!-- <span>{{storeDetailData.operator_name}}</span> -->
						<router-link :to="&quot;/opt/operator/detail/&quot;+ storeDetailData.operator_id">
							{{ storeDetailData.operator_name }}
						</router-link>
					</div>
				</el-col>
				<el-col
					v-if="storeDetailData.company_name"
					:span="12"
				>
					<div class="detail-item">
						<span>门店对应子公司：</span>
						<span>{{ storeDetailData.company_name }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>门店名称：</span>
						<span>{{ storeDetailData.store_name }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>门店建筑面积(㎡)：</span>
						<span>{{ storeDetailData.area }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>开业时间：</span>
						<span>{{ storeDetailData.open_time }}</span>
					</div>
				</el-col>
				<el-col
					v-if="storeDetailData.cooperat_mode>0"
					:span="12"
				>
					<div class="detail-item">
						<span>合作模式：</span>
						<span v-if="storeDetailData.cooperat_mode == 1">
							租赁
						</span>
						<span v-else-if="storeDetailData.cooperat_mode == 2">
							品牌输出
						</span>
						<span v-else-if="storeDetailData.cooperat_mode == 3">
							联合运营
						</span>
						<span v-else-if="storeDetailData.cooperat_mode == 4">
							其它
						</span>
					</div>
				</el-col>
				<el-col
					v-if="storeDetailData.expire_time"
					:span="12"
				>
					<div class="detail-item">
						<span>到期时间：</span>
						<span>{{ storeDetailData.expire_time }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>门店地址：</span>
						<span>{{ storeDetailData.address_name }}{{ storeDetailData.address }}</span>
					</div>
				</el-col>
				<el-col
					v-if="storeDetailData.buildings && storeDetailData.buildings.length>0"
					:span="24"
				>
					<div class="detail-item">
						<span>关联写字楼楼栋：</span>
						<span
							v-for="(item,index) in storeDetailData.buildings"
							:key="index"
						>
							{{ item.building_project_name }}{{ item.building_name }}
							<span v-if="(index+1) < storeDetailData.buildings.length">
								，
							</span>
						</span>
					</div>
				</el-col>
			</el-row>
		</div>
		<record
			:id="storeId"
			:type="1"
		/>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import record from "@/components/operation_record.vue";
import {
	storeDetail,
} from "@/api/api";
export default {
	components: {
		pageTitle,
		record,
	},
	data() {
		return {
			storeId: this.$route.params.id,
			storeDetailData: {},
		};
	},
	created() {
		this.getStoreDetail();
	},
	methods: {
		// 获取详情
		getStoreDetail() {
			storeDetail({id: this.storeId}).then(res => {
				this.storeDetailData = res.data;
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
	},
};
</script>

<style scoped lang="less">
</style>