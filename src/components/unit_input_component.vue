<template>
  <el-input :maxlength="maxlength" @keydown.native="onkeydown" :value="displayValue" :placeholder="placeholder" v-on:input="changeValue($event)"></el-input>
</template>
<script>

export default {
	props: {
		value: {
			type: String,
			default: ""
		},
		placeholder: String,
		maxlength: Number
	},
	data() {
		return {};
	},
	computed: {
		displayValue() {
			return this.value === "undefined" ? "" : this.value;
		}
	},
	created() {
	},
	methods: {
		changeValue(e) {
			let _value = e.toUpperCase();

			this.$emit("update:value", _value);
		},
		onkeydown(event) {
			let _code = event.charCode || event.keyCode;

			if (!((_code >= 48 && _code <= 57) || (_code >= 65 && _code <= 90) || [8, 37, 39].indexOf(_code) != -1)) {
				event.preventDefault();
				return;
			}
		}
	}
};
</script>
<style lang="less" scoped>

</style>