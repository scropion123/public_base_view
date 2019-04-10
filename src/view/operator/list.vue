<template>
  <div class="wrapper">
    <page-title title="运营商列表" />
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
          placeholder="请输入运营商名称/公司名称/公司地址"
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
          to="/opt/operator/add/0"
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
          <el-table-column label="运营商名称">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="detail(scope.row)"
              >
                {{ scope.row.operator_name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="company_name"
            label="公司名称"
          />
          <el-table-column label="有效门店数量">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="addStore(scope.row,2,'1')"
              >
                {{ scope.row.valid_store_num }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="失效门店数量">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="addStore(scope.row,2,'2')"
              >
                {{ scope.row.invalid_store_num }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="city_name"
            label="总部所在城市"
          />
          <el-table-column label="公司地址">
            <template slot-scope="scope">
              {{ scope.row.address_name }}{{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="is_administrator"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="addStore(scope.row,1)"
              >
                新增门店
              </el-button>
              <el-button
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
	getOperatorList, getProvinceCityList,
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
		let msg = storage.getItem("operator-list-msg");

		if (msg) {
			this.province_code = msg.province_code;
			this.city_code = msg.city_code;
			this.page_no = msg.page_no;
			this.keyword = msg.keyword;
			this.provinceCityListSelected = [msg.province_code, msg.city_code];
			storage.removeItem("operator-list-msg");
		}
		this.getProvinceCityList();
		this.getOperatorList();
	},
	methods: {
		saveFilter() {
			let msg = {
				province_code: this.province_code,
				city_code: this.city_code,
				keyword: this.keyword,
				page_no: this.page_no,
			};

			storage.setItem("operator-list-msg", msg);
		},
		detail(r) {
			this.saveFilter();
			this.$router.push("/opt/operator/detail/" + r.id);
		},
		edit(r) {
			this.saveFilter();
			this.$router.push("/opt/operator/add/" + r.id);
		},
		// 分页
		handleCurrentChange(val) {
			this.page_no = val;
			this.getOperatorList();
		},
		// 搜索
		handleSearch() {
			this.province_code = this.provinceCityListSelected[0];
			this.city_code = this.provinceCityListSelected[1];
			this.page_no = 1;
			this.getOperatorList();
		},
		getOperatorList() {
			this.loadingTable = true;
			let params = {
				address_province_code: this.province_code,
				address_city_code: this.city_code,
				keyword: this.keyword,
				page_no: this.page_no,
				page_size: this.page_size
			};

			getOperatorList(params).then(res => {
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
		// 新增门店
		addStore(data, type, status) {
			let msg = {
				operator_name: data.operator_name,
				operator_id: data.id,
			};

			if (type == 2) {
				msg.status = status;
			}
			storage.setItem("operator-data", msg);
			if (type == 1) {
				this.$router.push("/opt/store/add/0");
			} else if (type == 2) {
				this.$router.push("/opt/store/list");
			}
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