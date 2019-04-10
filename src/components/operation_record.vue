<template>
	<div class="opt-record">
		<page-title title="操作记录"></page-title>
		<div class="content">
			<el-table :data="tableList" border style="width: 100%" size="small">
				<el-table-column prop="title" label="标题" width="200">
				</el-table-column>
				<el-table-column prop="description" label="操作详情">
				</el-table-column>
				<el-table-column prop="create_user_name" label="操作人" width="80">
				</el-table-column>
				<el-table-column label="操作时间" prop="create_time" width="200">
					<!-- <template slot-scope="scope">
						{{scope.row.complete_rate + '%'}}
					</template> -->
				</el-table-column>
			</el-table>
			<div class="pagination" v-if="total">
				<el-pagination
					@current-change ="handleCurrentChange"
					background
					layout="total, prev, pager, next, jumper"
					:current-page="page_no"
					:total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import pageTitle from "@/view/common/page_title.vue";
import {
	getRecordList, getOptRecordList,
} from "@/api/api";
export default {
	props: ["id", "type"],
	components: {
		pageTitle,
	},
	data() {
		return {
			tableList: [],
			total: 0,
			page_no: 1,
			page_size: 10,
		};
	},
	created() {
		this.getRecordDetail();
	},
	methods: {
		// 分页
		handleCurrentChange(val) {
			this.page_no = val;
			this.getRecordDetail();
		},
		// 获取操作记录
		getRecordDetail() {
			return new Promise((resolve, reject) => {
				let params = {
					id: this.id,
					source_type: this.type,
					page_no: this.page_no,
				};

				if (this.type == 2 || this.type == 1) {
					getOptRecordList(params).then(res => {
						this.tableList = res.data.list;
						this.total = res.data.total;
						resolve();
					}).catch(() => {
						reject;
					});
				} else {
					getRecordList(params).then(res => {
						this.tableList = res.data.list;
						this.total = res.data.total;
						resolve();
					}).catch(() => {
						reject;
					});
				}
			});
		},
	}
};
</script>

<style scoped lang="less">
.opt-record {
	margin-top: 20px;
}
</style>