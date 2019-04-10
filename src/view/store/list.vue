<template>
  <div class="wrapper">
    <page-title title="门店列表" />
    <div class="content">
      <div class="handle-box">
        <el-select
          v-model="status"
          placeholder="请选择状态"
          size="small"
          clearable
          @change="handleSearch"
          @clear="handleSearch"
        >
          <el-option
            label="有效"
            value="1"
          />
          <el-option
            label="无效"
            value="2"
          />
        </el-select>
        <div class="block">
          <el-cascader
            v-model="provinceCityListSelected"
            size="small"
            clearable
            :options="provinceCityAreaList"
            change-on-select
            placeholder="请选择区域"
            @change="handleSearch"
          />
        </div>
        <el-input
          v-model="keyword"
          placeholder="请输入门店名称/详细地址/所属运营商"
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
          to="/opt/store/add/0"
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
          <el-table-column label="门店名称">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="detail(scope.row)"
              >
                {{ scope.row.store_name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="open_time"
            label="开业时间"
          />
          <el-table-column
            prop="area"
            label="门店建筑面积(㎡)"
          />
          <el-table-column label="门店地址">
            <template slot-scope="scope">
              {{ scope.row.address_name }}{{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cooperat_mode_name"
            label="合作模式"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.cooperat_mode == 1">
                租赁
              </span>
              <span v-else-if="scope.row.cooperat_mode == 2">
                品牌输出
              </span>
              <span v-else-if="scope.row.cooperat_mode == 3">
                联合运营
              </span>
              <span v-else-if="scope.row.cooperat_mode == 4">
                其它
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operator_name"
            label="所属运营商"
          >
            <template slot-scope="scope">
              <router-link :to="&quot;/opt/operator/detail/&quot;+ scope.row.operator_id">
                <el-button
                  size="mini"
                  type="text"
                >
                  {{ scope.row.operator_name }}
                </el-button>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{ scope.row.status == 1 ? '有效': '无效' }}
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
                @click="updateStoreStatus(scope.row)"
              >
                {{ scope.row.status==1?'置为无效' : '置为有效' }}
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="edit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="cancelStore(scope.row)"
              >
                作废门店
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
	getStoreList, getDicAreaCode, storeUpdateStatus, storeCancel,
} from "@/api/api";
export default {
	components: {
		pageTitle
	},
	data() {
		return {
			is_administrator: false,
			loadingTable: false,
			provinceCityAreaList: [],
			provinceCityListSelected: [],
			province_code: "",
			city_code: "",
			district_code: "",
			keyword: "",
			page_no: 1,
			page_size: 10,
			operator_id: "",
			status: "",
			total: 0,
			tableList: [],
			provinceList: [],
			dialogAddVisible: false,
		};
	},
	created() {
		let msg = storage.getItem("store-list-msg");
		// 从运营商列表进入时带入所属运营商
		let optMsg = storage.getItem("operator-data");

		if (optMsg) {
			this.keyword = optMsg.operator_name;
			this.operator_id = optMsg.operator_id;
			this.status = optMsg.status;
			storage.removeItem("operator-data");
		}
		if (msg) {
			this.province_code = msg.province_code;
			this.city_code = msg.city_code;
			this.district_code = msg.district_code;
			this.page_no = msg.page_no;
			this.keyword = msg.keyword;
			this.status = msg.status;
			this.provinceCityListSelected = [msg.province_code, msg.city_code, msg.district_code];
			storage.removeItem("store-list-msg");
		}
		this.getProvinceCityDistrict();
		this.getStoreList();
	},
	methods: {
		saveFilter() {
			let msg = {
				province_code: this.province_code,
				city_code: this.city_code,
				district_code: this.district_code,
				keyword: this.keyword,
				status: this.status,
				page_no: this.page_no,
			};

			storage.setItem("store-list-msg", msg);
		},
		detail(r) {
			this.saveFilter();
			this.$router.push("/opt/store/detail/" + r.id);
		},
		edit(r) {
			this.saveFilter();
			this.$router.push("/opt/store/add/" + r.id);
		},
		getProvinceCityDistrict() {
			getDicAreaCode({}).then(res => {
				this.provinceCityAreaList = res.data;
			});
		},
		// 分页
		handleCurrentChange(val) {
			this.page_no = val;
			this.getStoreList();
		},
		// 搜索
		handleSearch() {
			this.province_code = this.provinceCityListSelected[0];
			this.city_code = this.provinceCityListSelected[1];
			this.district_code = this.provinceCityListSelected[2];
			this.page_no = 1;
			this.operator_id = "";
			this.getStoreList();
		},
		getStoreList() {
			this.loadingTable = true;
			let params = {
				province_code: this.province_code,
				city_code: this.city_code,
				district_code: this.district_code,
				keyword: this.keyword,
				operator_id: this.operator_id,
				status: this.status,
				page_no: this.page_no,
				page_size: this.page_size
			};

			getStoreList(params).then(res => {
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
		// 门店上下架
		updateStoreStatus(data) {
			this.$confirm("确定将此条门店信息" + (data.status == 1 ? "置为无效" : "置为有效") + "吗?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				let params = {
					id: data.id,
					status: data.status == 1 ? 2 : 1,
				};

				storeUpdateStatus(params).then(res => {
					this.$message({
						message: res.message || "操作成功！",
						type: "success"
					});
					this.getStoreList();
				}).catch(err => {
					this.$message({
						message: err.message,
						type: "error"
					});
				});
			});
		},
		// 门店作废
		cancelStore(data) {
			this.$confirm("作废门店，系统将会自动删除该门店数据，不可恢复，是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				let params = {
					id: data.id,
				};

				storeCancel(params).then(res => {
					this.$message({
						message: res.message || "操作成功！",
						type: "success"
					});
					this.getStoreList();
				}).catch(err => {
					this.$message({
						message: err.message,
						type: "error"
					});
				});
			});
		}
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
		.el-select {
			margin-right: 10px;
		}
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
	.pagination {
		margin-top: 10px;
		text-align: center;
	}
	td button {
		margin-top: 5px;
		margin-right: 10px;
		margin-left: 0 !important;
	}
</style>