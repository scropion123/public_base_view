<template>
  <div class="title-row">
    <div class="title">{{title || "页面标题"}}</div>
  </div>
</template>
<script>
export default {
	props: {
		title: String,
		subTitle: String
	}
};
</script>
<style lang="less" scoped>
.title-row {
  margin-bottom: 20px;

  .title {
    border-left: 4px solid #0082fe;
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #f6f8f8;
    color: #2c3e50;
    padding-left: 15px;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>

