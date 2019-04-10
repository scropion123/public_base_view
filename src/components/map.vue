<template>
	<div class="map">
		<el-form-item
			label="划定区域范围"
			:rules="[
				{ required: true, message: '请划定区域范围', trigger: 'change' }
			]"
		>
			<div class="text-gray">
				<!-- <el-cascader
					placeholder="请选择区域"
					:options="provinceCityList"
					:value="selectedArea"
					change-on-select
					clearable
					@change="changeAreaSelect"
				/>
				<el-select
					v-model="addressVal"
					filterable
					remote
					reserve-keyword
					placeholder="请输入关键词"
					:remote-method="remoteMethod"
					:loading="loading"
					@change="addressDetailChange"
				>
					<el-option
						v-for="(item, index) in optionsArr"
						:key="index"
						:label="item.name"
						:value="item"
					/>
				</el-select> -->
				点击鼠标右键选择可切换区域范围中心点
			</div>
			<baidu-map
				:center="id > 0 ? areadata.finalCenterPoint : center"
				:zoom="zoom"
				:scroll-wheel-zoom="true"
				:double-click-zoom="!isInDrawing"
				:keyboard="!isInDrawing"
				class="bm-view"
				@ready="handler"
				@click="mouseDown"
				@rightclick="setCenterPointer"
			>
				<bm-city-list
					anchor="BMAP_ANCHOR_TOP_RIGHT"
					@changeAfter="changeCity"
				/>
				<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
				<bm-marker
					:position="areadata.finalCenterPoint"
					:dragging="true"
					animation="BMAP_ANIMATION_BOUNCE"
				/>
				<bm-control>
					<span
						v-if="!isInDrawing"
						class="draw-btn"
						@click="startDraw"
					>
						开始绘制
					</span>
					<span
						v-else
						class="draw-btn"
						@click="endDraw"
					>
						停止绘制
					</span>
					<span
						class="draw-btn"
						@click="clear"
					>
						重画
					</span>
				</bm-control>
				<bm-polyline
					:path="areadata.polyPointArray"
					stroke-color="blue"
					:stroke-opacity="0.5"
					:stroke-weight="2"
					:editing="isInDrawing"
				/>
				<bm-polygon
					:path="areadata.polygonAfterDraw"
					stroke-color="blue"
					:stroke-opacity="0.5"
					:stroke-weight="2"
					:editing="isInDrawing"
					@lineupdate="updatePolygonPath"
				/>
			</baidu-map>
		</el-form-item>
	</div>
</template>

<script>
import {
	getAddressDetailList,
} from "@/api/officeApi";
import {
	getProvinceCityList,
} from "@/api/api";
export default {
	props: ["data", "index", "type", "id"],
	data() {
		return {
			map: null,
			BMap: null,
			zoom: 3,
			center: {lng: 116.404, lat: 39.915},
			areadata: {},
			// newData: {},
			/** * 画圈有关的数据结构 ***/
			// 是否处于画圈状态下
			isInDrawing: false,
			// 是否处于鼠标左键按下状态下
			isMouseDown: false,
			// 上次操作画出的折线
			lastPolyLine: null,
			centerAdr: "",
			optionsArr: [],
			provinceCityList: [],
			loading: false,
			addressVal: "",
			selectedArea: [],
		};
	},
	watch: {
		// watch监听props里父组件传入data的变化，然后执行操作
		data(newV, oldV) {
			this.areadata = newV;
		}
	},
	created() {
		this.areadata = this.data;
		this.getProvinceCityList();
	},
	methods: {
		getProvinceCityList() {
			getProvinceCityList({}).then(res => {
				this.provinceCityList = res.data;
			});
		},
		handler({BMap, map}) {
			this.map = map;
			this.BMap = BMap;
			this.zoom = this.type == 1 ? 10 : 15;
		},
		// 选择区域
		changeAreaSelect(e) {
			this.selectedArea = e;
		},
		// 关键字搜索选择区域
		remoteMethod(query) {
			if (!query) {
				return;
			}
			if (!this.selectedArea || this.selectedArea.length < 2) {
				return;
			}
			let params = {
				city: this._getCityName(),
				address: query
			};

			this.loading = true;
			getAddressDetailList(params).then(res => {
				this.optionsArr = res.data;
				this.loading = false;
			}).catch(() => {

			});
		},
		// 根据所选区域code获取对应城市名称
		_getCityName() {
			let _cityList = [];
			let _provinceCode = this.selectedArea[0];
			let _provinceArr = this.provinceCityList.filter((item) => item.value == _provinceCode);

			if (!_provinceArr) {
				return "";
			}
			let _provinceObj = _provinceArr[0];

			_cityList = _provinceObj.children;
			let _cityArr = _cityList.filter(item => item.value == this.selectedArea[1]);

			if (!_cityArr) {
				return "";
			}

			return _cityArr[0].label;
		},
		// addressDetailChange 详细地址选择
		addressDetailChange(value) {
			this.addressVal = value.name;
			this.areadata.finalCenterPoint = {lng: value.longitude, lat: value.latitude};
			this.$emit("updateData", this.areadata);
			this.$forceUpdate();
		},
		// 设置中心点
		setCenterPointer(e) {
			this.areadata.finalCenterPoint = e.point;
			this.$emit("updateData", this.areadata);
		},
		// 开始绘制
		startDraw() {
			this.isInDrawing = true;
		},
		// 停止绘制
		endDraw() {
			// 如果处于画圈状态下 且 鼠标是按下状态
			if (this.isInDrawing && this.isMouseDown) {
				// 退出画线状态
				this.isInDrawing = false;
				this.isMouseDown = false;
				// 添加多边形覆盖物
				this.areadata.polygonAfterDraw = this.areadata.polyPointArray;
				this.$emit("updateData", this.areadata);
			}
		},
		updatePolylinePath(e) {
			this.drawPoint(e, 2);
		},
		updatePolygonPath(e) {
			this.drawPoint(e, 2);
		},
		// 鼠标左键单击开始绘制
		mouseDown(e) {
			this.drawPoint(e, 1);
		},
		// 画折线
		drawPoint(e, type) {
			// 如果处于画圈状态下,清空上次画圈的数据结构,设置isMouseDown进入画圈鼠标按下状态
			if (this.isInDrawing) {
				// 清空地图上画的折线和圈
				this.map.removeOverlay(this.areadata.polygonAfterDraw);
				this.map.removeOverlay(this.lastPolyLine);
				// this.areadata.polyPointArray = [];
				this.lastPolyLine = null;
				this.isMouseDown = true;
				if (this.isMouseDown) {
					if (type == 1) {
						this.areadata.polyPointArray.push(e.point);
					} else if (type == 2) {
						this.areadata.polyPointArray = e.target.getPath();
						this.areadata.polygonAfterDraw = e.target.getPath();
					}
					// 除去上次的画线
					if (this.lastPolyLine) {
						this.map.removeOverlay(this.lastPolyLine);
					}
					// 更新上次画线条
					this.lastPolyLine = this.areadata.polyPointArray;
				}
			}
		},
		// 鼠标右键单击绘制完成
		endMouseMove() {
			// 如果处于画圈状态下 且 鼠标是按下状态
			if (this.isInDrawing && this.isMouseDown) {
				// 退出画线状态
				this.isMouseDown = false;
				// 添加多边形覆盖物
				this.areadata.polygonAfterDraw = this.areadata.polyPointArray;
				this.$emit("updateData", this.areadata);
			}
		},
		// 清除覆盖物
		clear() {
			this.areadata.polygonAfterDraw = [];
			this.areadata.polyPointArray = [];
		},
		changeCity() {
			this.areadata.finalCenterPoint = {};
			this.clear();
		},
	}
};
</script>

<style scoped lang="less">
.bm-view {
	width: 100%;
	height: 500px;
	margin-bottom: 50px;
}
.draw-btn {
	padding: 6px 10px;
	background-color: #409EFF;
	color: #fff;
	margin-left: 10px;
	border-radius: 5px;
	cursor: pointer;
}
.el-select {
	margin-left: 10px;
}
</style>