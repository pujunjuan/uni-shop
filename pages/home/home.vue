<template>
	<view>
		<!-- 搜索框区域 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		
		<!-- 轮播图的区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view v-for="(item, i) in navList" :key="i" class="nav-item" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-image"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view>
			<!-- 楼层item -->
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor_title"></image>
				<!-- 楼层图片内容 -->
				<view class="floor-img-box">
					<!-- 楼层左侧图片盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" mode="widthFix" :style="{width:item.product_list[0].image_width+'rpx'}"></image>
					</navigator>
					<!-- 楼层右侧图片盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2!==0" :url="item2.url">
							<image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixin/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				//1.存放轮播图数据列表
				swiperList: [],
				//2.存放分类导航列表
				navList: [],
				//3.获取楼层数据
				floorList: []
			};
		},
		onLoad() {
			//调用方法，获取轮播图数据
			this.getSwiperList();
			//调用方法，获取分类导航数据
			this.getNavList();
			//调用方法，获取楼层数据
			this.getFloorList();
		},
		methods: {
			//获取轮播图
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata');
				if (res.meta.status !== 200) return uni.$showMsg();
				this.swiperList = res.message;
			},
			//获取分类数据
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems');
				if (res.meta.status !== 200) return uni.$showMsg();
				this.navList = res.message;
				console.log(res)
			},
			//分类点击页面跳转
			navClickHandler(item) {
				if (item.name == "分类") {
					uni.switchTab({
						url: '../cate/cate'
					})
				}
			},
			//获取楼层数据
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata');
				//对数据进行处理
				res.message.forEach(floor=>{
					floor.product_list.forEach(prod=>{
						prod.url='/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1];
					})
				})
				if (res.meta.status !== 200) return uni.$showMsg();
				this.floorList = res.message;
				console.log(res.message)
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
	.search-box{
		position: sticky;
		top: 0;
		z-index: 999;
	}
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0rpx;

		.nav-image {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor_title {
		width: 100%;
		height: 60rpx;
	}
	.floor-img-box{
		display: flex;
		padding-left: 10rpx;
	}
	.right-img-box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
