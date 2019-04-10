/*
* @Author: smallPang
*/
import fetch from "@/util/fetch";

// 代理配置
const TMPURL = process.env.NODE_ENV === "production" ? "/hi_coffice" : "/api/hi_coffice";
// 图片上传路径
const UPLOADURL = process.env.NODE_ENV === "production" ? "/public_base_info" : "/api/public_base_info";

// 登录
export function login(params) {
	return fetch.post(TMPURL + "/mis/user/rologin", params);
}

// 上传附件
export function fileUpload() {
	return (UPLOADURL + "/mis/image/upload");
}