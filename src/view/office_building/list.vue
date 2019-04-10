<template>
	<div v-loading="loading">
		<div class="wrapper">
			<page-title title="办公楼列表" />
			<!-- 办公楼列表 -->
			<div>
				<!-- 筛选部分 -->
				<div class="filter-row">
					<el-cascader
						clearable
						placeholder="请选择区域"
						:options="areaOptions"
						change-on-select
						@change="changeFilter"
					/>
					<el-input
						v-model="keyword"
						class="search-input"
						type="input"
						placeholder="写字楼项目名称、地址"
						clearable
						@keyup.enter.native="search"
						@clear="search"
					/>
					<el-button
						class="search-button"
						icon="el-icon-search"
						type="primary"
						@click="search"
					>
						搜索
					</el-button>
					<el-button
						v-if="isAdmin"
						class="add-button"
						icon="el-icon-plus"
						type="primary"
						@click="add"
					>
						新增
					</el-button>
				</div>
				<!-- 列表部分 -->
				<div class="list-container">
					<el-table
						stripe
						border
						class="list-table"
						:data="list"
					>
						<el-table-column
							label="写字楼名称"
						>
							<template slot-scope="scope">
								<a
									class="project-name"
									@click="view(scope.row)"
								>
									{{ scope.row.project_name }}
								</a>
							</template>
						</el-table-column>
						<el-table-column
							prop="update_time"
							label="更新时间"
						/>
						<el-table-column
							prop="address"
							label="详细地址"
						/>
						<el-table-column
							prop="building_num"
							label="楼栋数"
						/>
						<el-table-column
							label="操作"
						>
							<template slot-scope="scope">
								<el-button
									v-if="isAdmin"
									type="primary"
									size="small"
									@click="edit(scope.row)"
								>
									编辑
								</el-button>
								<el-button
									type="success"
									size="small"
									@click="view(scope.row)"
								>
									详情
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!-- 分页部分 -->
				<div v-if="list && list.length > 0">
					<el-pagination
						background
						:current-page.sync="currentPage"
						:page-size="pageSize"
						layout="total, prev, pager, next, jumper"
						:total="total"
						@current-change="handleCurrentChange"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import pageTitle from "@/view/common/page_title.vue";
import {
	getDicAreaCode
} from "@/api/api.js";
import {
	getBuildingProjectList
} from "@/api/officeApi.js";

export default {
	components: {
		pageTitle
	},
	data() {
		return {
			areaOptions: [],
			selectedAreaOptions: [],
			list: [],
			total: 0,
			pageSize: 10,
			currentPage: 1,
			keyword: "",
			loading: false,
			isAdmin: false
		};
	},
	mounted() {
		this._getDicAreaCode().then((res) => {
			this.areaOptions = res.data;
		});
		this._getList();
	},
	methods: {
		// 获取省市区数据
		async _getDicAreaCode() {
			return await getDicAreaCode();
		},
		changeFilter(e) {
			this.selectedAreaOptions = e;
			this._getList();
		},
		handleCurrentChange() {
			this._getList();
		},
		// 新增写字楼
		add() {
			let _href = this.$router.resolve({
				name: "add_office_building"
			});

			window.open(_href.href);
		},
		search() {
			this.currentPage = 1;
			this._getList();
		},
		// 获取写字楼列表
		_getList() {
			this.loading = true;
			let _data = {
				page_no: this.currentPage,
				page_size: this.pageSize
			};

			this.keyword && (_data.keyword = this.keyword);
			if (this.selectedAreaOptions && this.selectedAreaOptions.length > 0) {
				this.selectedAreaOptions[0] && (_data.province_code = this.selectedAreaOptions[0]);
				this.selectedAreaOptions[1] && (_data.city_code = this.selectedAreaOptions[1]);
				this.selectedAreaOptions[2] && (_data.district_code = this.selectedAreaOptions[2]);
			}
			getBuildingProjectList(_data).then(res => {
				this.total = res.data.total;
				this.list = res.data.list;
				this.isAdmin = res.data.is_administrator;
				this.loading = false;
			});
		},
		// 查看详情
		view(item) {
			let _url = this.$router.resolve({
				name: "office_building_detail",
				params: {
					id: item.id
				}
			});

			_url.href && window.open(_url.href);
		},
		// 编辑
		edit(item) {
			let _url = this.$router.resolve({
				name: "edit_office_building",
				params: {
					id: item.id
				}
			});

			_url.href && window.open(_url.href);
		}
	}
};
</script>
<style lang="less" scoped>
.filter-row {
	display: flex;
	align-items: center;

	.search-input {
		margin-left: 10px;
		width: 300px;
	}
	.search-button {
		margin-left: 20px;
	}
}

.list-container {
	margin-top: 10px;
	.list-table {
		width: 100%;
	}
}

.project-name {
	cursor: pointer;
	color: #409EFF;
}
</style>

