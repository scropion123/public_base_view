/*
* @Author: ASUS
* @Date:   2018-03-07 16:19:08
* @Last Modified by:   ASUS
* @Last Modified time: 2018-07-11 10:29:19
*/
import fetch from "@/util/fetch";

// 代理配置
const TMPURL = process.env.NODE_ENV === "production" ? "/public_base_info/mis" : "/api/public_base_info/mis";
const OPTURL = process.env.NODE_ENV === "production" ? "/operator/mis" : "/api/operator/mis";

// 省市二级联动筛选基础数据
export function getProvinceCityList(params) {
	return fetch.get(TMPURL + "/regionalism/get_code_filter_data", params);
}
// 省列表
export function getProvinceList(params) {
	return fetch.get(TMPURL + "/regionalism/get_province_list", params);
}
// 市列表
export function getCity(params) {
	return fetch.get(TMPURL + "/regionalism/get_city_list", params);
}

// 操作记录
export function getRecordList(params) {
	return fetch.get(TMPURL + "/operation_record/operate_list", params);
}
// 行政区划列表
export function getAreaList(params) {
	return fetch.get(TMPURL + "/regionalism/regionalism_list", params);
}
// 新增行政区
export function areaAddSubmit(params) {
	return fetch.post(TMPURL + "/regionalism/regionalism_add", params);
}
// 编辑行政区
export function areaEditSubmit(params) {
	return fetch.post(TMPURL + "/regionalism/regionalism_update", params);
}
// 行政区详情
export function areaDetail(params) {
	return fetch.get(TMPURL + "/regionalism/regionalism_detail", params);
}
// 省市区联动接口
export function getDicAreaCode(params) {
	return fetch.get(TMPURL + "/regionalism/get_dic_area_code", params);
}
// 市区商圈联动接口
export function getCityBusinessData(params) {
	return fetch.get(TMPURL + "/regionalism/get_city_buiness_data", params);
}

// 商圈列表
export function getBusinessList(params) {
	return fetch.get(TMPURL + "/business_area/business_list", params);
}
// 新增商圈
export function businessAddSubmit(params) {
	return fetch.post(TMPURL + "/business_area/create_business", params);
}
// 编辑商圈
export function businessEditSubmit(params) {
	return fetch.post(TMPURL + "/business_area/update_business", params);
}
// 商圈详情
export function businessDetail(params) {
	return fetch.get(TMPURL + "/business_area/business_detail", params);
}

// 运营商查询已存在的机构列表
export function getOrgList(params) {
	return fetch.get(OPTURL + "/organization/list", params);
}
// 搜索天眼查企业列表
export function getTyOrgList(params) {
	return fetch.get(OPTURL + "/organization/ty_org_list", params);
}
// 天眼查企业详情
export function getTyOrgDetail(params) {
	return fetch.get(OPTURL + "/organization/ty_org_detail", params);
}
// 企业新增
export function ownOrgAdd(params) {
	return fetch.post(OPTURL + "/organization/org_create", params);
}
// 运营商操作记录
export function getOptRecordList(params) {
	return fetch.get(OPTURL + "/operation_record/operate_list", params);
}
// 运营商列表
export function getOperatorList(params) {
	return fetch.get(OPTURL + "/operator/list", params);
}
// 新增运营商
export function operatorAddSubmit(params) {
	return fetch.post(OPTURL + "/operator/create", params);
}
// 编辑运营商
export function operatorEditSubmit(params) {
	return fetch.post(OPTURL + "/operator/update", params);
}
// 运营商详情
export function operatorDetail(params) {
	return fetch.get(OPTURL + "/operator/detail", params);
}
// 查询运营商关联公司
export function getOperatorCom(params) {
	return fetch.get(OPTURL + "/operator/company_list", params);
}
// 门店列表
export function getStoreList(params) {
	return fetch.get(OPTURL + "/store/list", params);
}
// 新增门店
export function storeAddSubmit(params) {
	return fetch.post(OPTURL + "/store/create", params);
}
// 编辑门店
export function storeEditSubmit(params) {
	return fetch.post(OPTURL + "/store/update", params);
}
// 门店详情
export function storeDetail(params) {
	return fetch.get(OPTURL + "/store/detail", params);
}
// 门店上下架
export function storeUpdateStatus(params) {
	return fetch.post(OPTURL + "/store/update_status", params);
}
// 作废门店
export function storeCancel(params) {
	return fetch.post(OPTURL + "/store/cancel", params);
}
// 门店查询对应写字楼
export function searchProjectList(params) {
	return fetch.get(OPTURL + "/store/get_building_project_list", params);
}
// 门店查询对应写字楼楼栋
export function searchBuildingList(params) {
	return fetch.get(OPTURL + "/store/get_building_list", params);
}