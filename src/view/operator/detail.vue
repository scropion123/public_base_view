<template>
	<div class="wrapper">
		<page-title title="运营商详情" />
		<div class="content">
			<div class="detail-btn-box">
				<router-link to="/opt/operator/list">
					<el-button
						class="backBtn"
						size="medium"
					>
						返 回
					</el-button>
				</router-link>
				<router-link
					v-if="operatorData.is_administrator"
					:to="&quot;/opt/operator/add/&quot;+operatorId"
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
						<span>运营商名称：</span>
						<span>{{ operatorData.operator_name }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>公司名称：</span>
						<span>{{ operatorData.company_name }}</span>
					</div>
				</el-col>
				<el-col
					v-if="operatorData.city_name"
					:span="12"
				>
					<div class="detail-item">
						<span>总部所在城市：</span>
						<span>{{ operatorData.city_name }}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="detail-item">
						<span>公司地址：</span>
						<span>{{ operatorData.address_name }}{{ operatorData.address }}</span>
					</div>
				</el-col>
				<el-col
					v-if="operatorData.operator_company && operatorData.operator_company.length>0"
					:span="24"
				>
					<div class="detail-item">
						<span>子/分公司名称：</span>
						<span
							v-for="(item, index) in operatorData.operator_company"
							:key="index"
						>
							{{ item.company_name }}
							<span v-if="(index+1) < operatorData.operator_company.length">
								，
							</span>
						</span>
					</div>
				</el-col>
				<el-col
					v-if="operatorData.content"
					:span="24"
				>
					<div class="detail-item">
						<span>公司简介：</span>
						<span>{{ operatorData.content||'--' }}</span>
					</div>
				</el-col>
				<el-col
					v-if="operatorData.buildings && operatorData.buildings.length>0"
					:span="24"
				>
					<div class="detail-item">
						<span>关联写字楼楼栋：</span>
						<span
							v-for="(item,index) in operatorData.buildings"
							:key="index"
						>
							{{ item.building_project_name }}{{ item.building_name }}({{ item.store_name }})
							<span v-if="(index+1) < operatorData.buildings.length">
								，
							</span>
						</span>
					</div>
				</el-col>
			</el-row>
		</div>
		<record
			:id="operatorId"
			:type="2"
		/>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import record from "@/components/operation_record.vue";
import {
	operatorDetail,
} from "@/api/api";
export default {
	components: {
		pageTitle,
		record,
	},
	data() {
		return {
			operatorId: this.$route.params.id,
			operatorData: {},
		};
	},
	created() {
		this.getOperatorDetail();
	},
	methods: {
		getOperatorDetail() {
			operatorDetail({id: this.operatorId}).then(res => {
				this.operatorData = res.data;
			}).catch(err => {
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		}
	},
};
</script>

<style scoped lang="less">
</style>