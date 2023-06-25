<template>
	<view>
		<my-search @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滑动区域 -->
			<scroll-view scroll-y="true" :style="{height: wh+'px'}" class="left-scroll-view">
				<block v-for="(item,i) in cateList" :key="i">
					<view :class="['left-scroll-view-item',i===active?'active':'']" @click="activeChange(i)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区域 -->
			<scroll-view scroll-y="true" :style="{height: wh+'px'}" class="right-scroll-view" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
					<!-- 二级分类标题 -->
					<view class="cate-lv2-title">
						/{{item2.cat_name}}/
					</view>
					<!-- 动态渲染三级分类数据 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoosList(item3)">
							<!-- 三级分类图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 三级分类文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixin/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				//当前设备可用高度
				wh: 0,
				//分类数据
				cateList: [],
				active:0,
				//二级分类列表
				cateLevel2:[],
				//滚动条距离顶部的位置
				scrollTop:0

			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync();
			this.wh = sysInfo.windowHeight;
			this.getCateList();
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories');
				if (res.meta.status !== 200) return uni.$showMsg();
				this.cateList = res.message;
				//二级分类数据
				this.cateLevel2=res.message[0].children;
			},
			activeChange(i){
				this.active=i;
				//重新为二级分类赋值
				this.cateLevel2=this.cateList[i].children;
				//重置滚动条的位置
				this.scrollTop=this.scrollTop===0?1:0;
			},
			//跳转商品详情页
			gotoGoosList(item){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid='+item.cat_id
				})
			},
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			height: 100%;
			width: 240rpx;

			.left-scroll-view-item {
				background-color: #f7f7f7;
				line-height: 120rpx;
				text-align: center;
				font-size: 24rpx;

				&.active {
					background-color: #ffffff;
					position: relative;

					&::before {
						content: " ";
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}
	}
	.cate-lv2-title{
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0px;
	}
	.cate-lv3-list{
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;
		
		.cate-lv3-item{
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			
			image{
				width: 60px;
				height: 60px;
			}
			
			text{
				font-size: 12px;
			}
		}
	}
</style>