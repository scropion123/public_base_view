export default {
	phoneReg: /^1[3-9]\d{9}$/
};

export function formatDate(date, fmt) {
	if ((/(y+)/).test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	let o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds()
	};

	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + "";

			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
		}
	}
	return fmt;
}
function padLeftZero(str) {
	return ("00" + str).substr(str.length);
}
export function formatToDate(timestamp, hasTime) {
	// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let date = new Date(timestamp * 1000);
	let Y = date.getFullYear() + "-";
	let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
	let D = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + " ";
	let h = date.getHours() + ":";
	let m = date.getMinutes() + ":";
	let s = date.getSeconds();

	if (!hasTime) {
		return Y + M + D;
	} else {
		return Y + M + D + h + m + s;
	}
}