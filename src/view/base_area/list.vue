<template>
  <div class="wrapper">
    <page-title title="行政区划列表" />
    <div class="content">
      <div class="handle-box">
        <div class="block">
          <el-cascader
            v-model="provinceCityListSelected"
            size="small"
            clearable
            :options="provinceCityList"
            change-on-select
            placeholder="请选择区域"
            @change="handleSearch"
          />
        </div>
        <el-input
          v-model="keyword"
          placeholder="省、市、区"
          class="search-input"
          size="small"
          clearable
          @keyup.enter.native="handleSearch"
          @clear="handleSearch"
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <router-link
          v-if="is_administrator"
          to="/base/area/add/0"
        >
          <el-button
            class="add-btn"
            type="primary"
            icon="el-icon-plus"
            size="small"
          >
            新增
          </el-button>
        </router-link>
      </div>
      <div v-loading="loadingTable">
        <el-table
          :data="tableList"
          border
          style="width: 100%"
          size="small"
        >
          <el-table-column
            prop="official_code"
            label="行政代码"
          />
          <el-table-column
            prop="province"
            label="省"
          />
          <el-table-column
            prop="city"
            label="市"
          />
          <el-table-column
            prop="district"
            label="区"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="detail(scope.row)"
              >
                详情
              </el-button>
              <el-button
                v-if="is_administrator"
                size="mini"
                type="primary"
                @click="edit(scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="total"
          class="pagination"
        >
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :current-page="page_no"
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
import storage from "@/util/storage";
import {
	getAreaList, getProvinceCityList,
} from "@/api/api";
export default {
	components: {
		pageTitle
	},
	data() {
		return {
			is_administrator: false,
			loadingTable: false,
			provinceCityList: [],
			provinceCityListSelected: [],
			province_code: "",
			city_code: "",
			keyword: "",
			page_no: 1,
			page_size: 10,
			total: 0,
			tableList: [],
			provinceList: [],
			dialogAddVisible: false,
		};
	},
	created() {
		let msg = storage.getItem("area-list-msg");

		if (msg) {
			this.province_code = msg.province_code;
			this.city_code = msg.city_code;
			this.page_no = msg.page_no;
			this.keyword = msg.keyword;
			this.provinceCityListSelected = [msg.province_code, msg.city_code];
			storage.removeItem("area-list-msg");
		}
		this.getProvinceCityList();
		this.getAreaList();
	},
	methods: {
		saveFilter() {
			let msg = {
				province_code: this.province_code,
				city_code: this.city_code,
				keyword: this.keyword,
				page_no: this.page_no,
			};

			storage.setItem("area-list-msg", msg);
		},
		detail(r) {
			this.saveFilter();
			this.$router.push("/base/area/detail/" + r.id);
		},
		edit(r) {
			this.saveFilter();
			this.$router.push("/base/area/add/" + r.id);
		},
		// 分页
		handleCurrentChange(val) {
			this.page_no = val;
			this.getAreaList();
		},
		// 搜索
		handleSearch() {
			this.province_code = this.provinceCityListSelected[0];
			this.city_code = this.provinceCityListSelected[1];
			this.page_no = 1;
			this.getAreaList();
		},
		getAreaList() {
			this.loadingTable = true;
			let params = {
				province_code: this.province_code,
				city_code: this.city_code,
				keyword: this.keyword,
				page_no: this.page_no,
				page_size: this.page_size
			};

			getAreaList(params).then(res => {
				this.loadingTable = false;
				this.is_administrator = res.data.is_administrator;
				this.tableList = res.data.list;
				this.total = Number(res.data.total);
			}).catch(err => {
				this.loadingTable = false;
				this.$message({
					message: err.message,
					type: "error"
				});
			});
		},
		getProvinceCityList() {
			let params = {};

			getProvinceCityList(params).then(res => {
				this.provinceCityList = res.data;
			});
		},
	},
};
</script>

<style scoped lang="less">
	.handle-box{
		margin-bottom: 20px;
		overflow: hidden;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		/*过滤*/
		.search-input{
			width: 300px;
			display: inline-block;
			margin-right: 10px;
			margin-left: 10px;
		}
		.add-btn {
			margin-left: 10px;
		}
	}
	td button {
		margin-top: 5px;
	}
	.pagination {
		margin-top: 10px;
		text-align: center;
	}
</style>