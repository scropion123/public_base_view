import fetch from "@/util/fetch";
// 代理配置
const TMPURL = process.env.NODE_ENV === "production" ? "/public_base_info/mis" : "/api/public_base_info/mis";

// 写字楼项目列表
export function getBuildingProjectList(params) {
	return fetch.get(TMPURL + "/building_project/building_project_list", params);
}
// 写字楼项目详情
export function getBuildingProjectDetail(params) {
	return fetch.get(TMPURL + "/building_project/business_project_detail", params);
}

// 写字楼价格单位信息
export function getPriceUnitList(params) {
	return fetch.get(TMPURL + "/building_project/price_unit_list", params);
}

// 物业类型信息
export function getPropertyTypes(params) {
	return fetch.get(TMPURL + "/building_project/property_type", params);
}

// 详细地址搜索
export function getAddressDetailList(params) {
	return fetch.get(TMPURL + "/building_project/get_baidu_landmarks", params);
}

// 商圈
export function getSimpleList(params) {
	return fetch.get(TMPURL + "/business_area/simple_list", params);
}

// 写字楼项目 第一步新增
export function createBuildingProjectFirst(params) {
	return fetch.post(TMPURL + "/building_project/create_building_project_first", params);
}

// 写字楼项目 第一步 编辑 update_building_project_first
export function updateBuildingProjectFirst(params) {
	return fetch.post(TMPURL + "/building_project/update_building_project_first", params);
}

// 供电系统类型接口
export function getElectricSyctemList(params) {
	return fetch.get(TMPURL + "/building_project/electric_system_list", params);
}

// 写字楼项目 第二步 编辑
export function updateBuildingProjectSecond(params) {
	return fetch.post(TMPURL + "/building_project/update_building_project_second", params);
}

// 写字楼等级
export function getBuildingLevelList(params) {
	return fetch.get(TMPURL + "/building_project/building_level_list", params);
}

// 产品归属接口
export function getPropertyOwnerList(params) {
	return fetch.get(TMPURL + "/building_project/property_owner_list", params);
}

// 产业聚焦接口
export function getIndustrysList(params) {
	return fetch.get(TMPURL + "/building_project/industrys_list", params);
}

// 新增楼栋主信息
export function saveBuilding(params) {
	return fetch.post(TMPURL + "/building/save_building", params);
}

// 楼栋列表
export function getBuildingList(params) {
	return fetch.get(TMPURL + "/building/building_list", params);
}

// 建筑类型
export function getBuildingTypeList(params) {
	return fetch.get(TMPURL + "/building_project/building_type_list", params);
}

// 外墙接口
export function getFacadeTypeList(params) {
	return fetch.get(TMPURL + "/building_project/facade_type_list", params);
}

// good_size_list 货梯尺寸接口
export function getGoodSizeList(params) {
	return fetch.get(TMPURL + "/building_project/good_size_list", params);
}

// 中央空调类型
export function getACTypeList(params) {
	return fetch.get(TMPURL + "/building_project/ac_type_list", params);
}

// 中央空调供应时间
export function getACTimeList(params) {
	return fetch.get(TMPURL + "/building_project/ac_time_list", params);
}

// 编辑开发商联系人
export function updateDeveloper(params) {
	return fetch.post(TMPURL + "/building_project/save_building_project_developer", params);
}
