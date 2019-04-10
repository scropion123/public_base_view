<template>
  <div class="textarea-container">
    <el-input class="my-textarea" type="textarea" :maxlength="maxlength" autosize :value="value" v-on:input="changeTextarea($event)" :placeholder="placeholder"></el-input>
    <div class="count">{{value.length}}/{{maxlength}}</div>
  </div>
</template>
<script>
export default {
	props: {
		maxlength: {
			type: Number,
			default: 200
		},
		value: {
			type: String,
			default: ""
		}
	},
	computed: {
		placeholder() {
			return this.maxlength + "字以内";
		}
	},
	data() {
		return {
			focus: false
		};
	},
	methods: {
		changeTextarea(e) {
			this.$emit("update:value", e);
		},
		focusFn() {
			this.focus = true;
		}
	}
};
</script>
<style lang="less">
.textarea-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .el-textarea {
    vertical-align: baseline;
    flex: 1;
  }
  .el-textarea__inner{
    border: none !important;
    resize: none;
    padding: 0;
  }
}
.textarea-container:hover {
  border: 1px solid #c0c4cc;
  border-color: #409EFF;
  outline: 0;
}

.count {
  text-align: right;
  color:#c0c4cc;
  line-height: normal;
}

</style>

