import fetch from "@/util/fetch";
// 代理配置
const TMPURL = process.env.NODE_ENV === "production" ? "/public_base_info/mis" : "/api/public_base_info/mis";

// 地铁列表
export function getMetroList(params) {
	return fetch.get(TMPURL + "/subway/subway_list", params);
}
