<template>
	<div v-loading="loading">
		<div class="wrapper">
			<page-title title="地铁列表" />
			<!-- 地铁列表 -->
			<div>
				<!-- 搜索filter -->
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
						placeholder="线路、站点名"
						clearable
						@keyup.enter.native="_getMetroList"
						@clear="_getMetroList"
					/>
					<el-button
						class="search-button"
						icon="el-icon-search"
						type="primary"
						@click="_getMetroList"
					>
						搜索
					</el-button>
				</div>
				<!-- 列表部分 -->
				<div class="list-container">
					<el-table
						v-loading="loading"
						stripe
						border
						class="list-table"
						:data="list"
					>
						<el-table-column
							prop="city"
							label="城市"
						/>
						<el-table-column
							prop="subway_line"
							label="线路名"
						/>
						<el-table-column
							prop="station"
							label="站点名"
						/>
						<el-table-column
							label="是否为换乘站"
						>
							<template slot-scope="scope">
								{{ scope.row.is_trans_station == 0 ? "否" : "是" }}
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!-- 列表分页 -->
				<div>
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
	getProvinceCityList
} from "@/api/api.js";
import {
	getMetroList
} from "@/api/metroApi.js";

export default {
	components: {
		pageTitle
	},
	data() {
		return {
			areaOptions: [],
			selectedAreaOptions: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loading: false,
			keyword: "",
			list: []
		};
	},
	mounted() {
		this._getAreaOptions().then(res => {
			this.areaOptions = res.data;
		});
		this._getMetroList();
	},
	methods: {
		// 省市过滤
		changeFilter(e) {
			this.selectedAreaOptions = e;
			this._getMetroList();
		},
		// 获取省市区联动数据
		_getAreaOptions: async () => await getProvinceCityList(),
		// 地铁列表分页
		handleCurrentChange() {
			this._getMetroList();
		},
		// 获取地铁列表数据
		_getMetroList() {
			this.loading = true;
			let _data = {
				page_no: this.currentPage,
				page_size: this.pageSize
			};

			this.selectedAreaOptions[0] && (_data.province_code = this.selectedAreaOptions[0]);
			this.selectedAreaOptions[1] && (_data.city_code = this.selectedAreaOptions[1]);
			this.keyword && (_data.keyword = this.keyword.trim());
			getMetroList(_data).then((res) => {
				this.total = res.data.total;
				this.list = res.data.list;
				this.loading = false;
			});
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
</style>

