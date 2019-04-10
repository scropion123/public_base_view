<template>
  <el-input :maxlength="maxlength" @keydown.native="onkeydown" @keyup.native="onkeyup" :value="displayValue" :placeholder="placeholder" v-on:input="changeValue($event)"></el-input>
</template>
<script>

export default {
	props: {
		intlength: {
			type: Number,
			default: 10
		},
		decimallength: {
			type: Number,
			default: 2
		},
		isDecimal: {
			type: Boolean,
			default: false
		},
		value: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			oldValue: ""
		};
	},
	computed: {
		displayValue() {
			return this.value === "undefined" ? "" : this.value;
		},
		maxlength() {
			return this.isDecimal ? this.intlength + this.decimallength + 1 : this.intlength;
		},
		placeholder() {
			return this.isDecimal ? "最多" + this.intlength + "位整数,最多" + this.decimallength + "位小数" : "最多" + this.intlength + "位整数";
		}
	},
	created() {
		let _reg = "";
		let _decimalReg = "";
		let _int = parseInt(this.intlength);
		let _decimal = parseInt(this.decimallength);

		_reg = new RegExp("(^([1-9](\\d{1," + (_int - 1) + "})?)$)|(^0$)");
		if (this.isDecimal) {
			_decimalReg = new RegExp("(^([1-9](\\d{1," + (_int - 1) + "})?)?(\\.?|(\\.\\d{1," + _decimal + "})?)$)|(^0$)|(^0(\\.?|\\.\\d{1," + _decimal + "})$)");
		}
		this._reg = _reg;
		this._decimalReg = _decimalReg;
	},
	methods: {
		changeValue(e) {
			this.$emit("update:value", e);
		},
		onkeydown(event) {
			this.oldValue = this.value;
			// 输入必须是 0-9 或者 .
			let _code = event.charCode || event.keyCode;

			let _isMetaKey = event.metaKey;
			let _isCtrlKey = event.ctrlKey;

			// 只允许数字 退格 ctrl+c。允许出现小数的时候出现还允许.(keycode=190) TODO 全角半角判断
			if (!(((_code == 67 || _code == 86) && (_isMetaKey || _isCtrlKey)) || (_code >= 48 && _code <= 57) || _code == 8 || (_code == 190 && this.isDecimal) || (_code == 37 || _code == 39))) {
				event.preventDefault();
			}
		},
		onkeyup() {
			if (this.isDecimal) {
				if (this.value && !this._reg.test(this.value) && !this._decimalReg.test(this.value)) {
					// this.value = this.oldValue;
					this.$emit("update:value", this.oldValue);
				}
			} else {
				if (this.value && !this._reg.test(this.value)) {
					// this.value = this.oldValue;
					this.$emit("update:value", this.oldValue);
				}
			}

			if (this.value == ".") {
				// this.value = "0" + this.value;
				this.$emit("update:value", this.oldValue);
			}
		}
	}
};
</script>
<style lang="less" scoped>

</style>