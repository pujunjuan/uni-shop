<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj:{
					query:'',
					cid:'',
					pageNum:1,
					pageSize:10
				},
				goodsList:[],
				total:0,
				//节流阀
				isLoading:false
			}
		},
		onLoad(options){
			this.queryObj.query=options.query||'';
			this.queryObj.cid=options.cid||'';
			this.getGoodsList();
		},
		//上拉加载更多事件
		onReachBottom(){
			
			if(this.queryObj.pageNum*this.queryObj.pageSize>=this.total) return uni.$showMsg("数据加载完毕！")
			
			if(this.isLoading) return
			
			this.queryObj.pageNum+=1;
			this.getGoodsList();
		},
		//下拉刷新事件
		onPullDownRefresh() {
			//重置关键数据
			this.queryObj.pageNum=1;
			this.total=0;
			this.isLoading=false;
			this.goodsList=[];
			//重新发起请求
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		},
		methods: {
			async getGoodsList(cb){
				//打开节流阀
				this.isLoading=true
				const {data:res}=await uni.$http.get('/api/public/v1/goods/search',this.queryObj);
				//关闭节流阀
				this.isLoading=false;
				cb && cb();
				if (res.meta.status !== 200) return uni.$showMsg();
				this.goodsList= [...this.goodsList,...res.message.goods];
				this.total=res.message.total;
			},
			gotoDetail(goods){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
				})
			}
		}
	}
</script>

<style lang="scss">
	
</style>
