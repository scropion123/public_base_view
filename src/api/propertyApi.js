import fetch from "@/util/fetch";
// 代理配置
const TMPURL = process.env.NODE_ENV === "production" ? "/public_base_info/mis" : "/api/public_base_info/mis";

// 物业列表
export function getPropertyList(params) {
	return fetch.get(TMPURL + "/Property_company/list", params);
}
// 物业新增
export function createProperty(params) {
	return fetch.post(TMPURL + "/Property_company/create", params);
}
// 物业编辑
export function updateProperty(params) {
	return fetch.post(TMPURL + "/Property_company/update", params);
}