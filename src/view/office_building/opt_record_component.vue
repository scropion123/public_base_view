<template>
	<div>
		<recordComponent
			:id="officeProject.id"
			ref="recordComponent"
			:type="3"
		/>
	</div>
</template>
<script>
import recordComponent from "@/components/operation_record.vue";

export default {
	components: {
		recordComponent
	},
	computed: {
		officeProject() {
			return this.$store.getters.officeProject;
		}
	},
	methods: {
		getRecordList() {
			this.$refs["recordComponent"] && this.$refs["recordComponent"].getRecordDetail();
		}
	}
};
</script>
<style lang="less" scoped>

</style>
