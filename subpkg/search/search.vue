<template>
	<view class="search-box">
		<uni-search-bar @confirm="search" @input="input" cancelButton="none" @blur="blur" @cancel="cancel"
			:radius="100">
		</uni-search-bar>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
				<view class="goods-name">
					{{item.goods_name}}
				</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag v-for="(item,i) in histories" :key="i" :text="item"  @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				//搜索的结果列表
				searchResults: [],
				//搜索历史的数组
				historyList:[]
			};
		},
		onLoad(){
			this.historyList=JSON.parse(uni.getStorageSync('kw')|| '[]');
		},
		methods: {
			//input输入事件的处理
			input(e) {
				//清除对应timer延时器
				clearTimeout(this.timer)
				//重新启动一个延时器，并把timerId赋值给this。timer
				this.timer = setTimeout(() => {
					//如果500毫秒内，没有触发新的输入事件，则为搜索关键词赋值
					this.kw = e.value,
					this.getSearchList();
				}, 1000)
			},
			async getSearchList() {
				if (this.kw.length === 0) {
					this.searchResults = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg();
				this.searchResults = res.message;
				this.saveSearchHistory();
				
			},
			gotoDetail(item){
				uni.navigateTo({
					url:"/subpkg/goods_detail/goods_detail?id="+item.goods_id
				})
			},
			saveSearchHistory(){
				//this.historyList.push(this.kw);
				//解决搜索关键词重复的问题
				//创建一个Set实例对象，将Array数组转化为Set对象
				const mySet=new Set(this.historyList);
				//调用Set对象的delete方法，移除对应的元素
				mySet.delete(this.kw);
				//调用Set对象的add方法，向Set添加对应的元素
				mySet.add(this.kw);
				//将Set转化为Array数组
				this.historyList=Array.from(mySet)
				//调用uni.setStorageSync对搜索历史数据进行持久化的存储
				uni.setStorageSync('kw',JSON.stringify(this.historyList));
			},
			//清空搜索历史存储数据
			clean(){
				this.historyList=[];
				uni.setStorageSync('kw','[]')
			},
			gotoGoodsList(kw){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+kw
				})
			}
		},
		computed:{
			histories(){
				return [...this.historyList].reverse();
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
	.sugg-list{
		padding: 0px 5px;
		
		
		.sugg-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 0px;
			border-bottom: 1px solid #efefef;
		}
		.goods-name{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.history-box{
		padding: 0 5px;
		
		.history-title{
			display: flex;
			justify-content: space-between;
			height: 40px;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}
		.history-list{
			display: flex;
			flex-wrap: wrap;
			.uni-tag{
				margin-top: 5px;
				margin-right: 5px;
			}
		}
		
	}
</style>