<template>
	<view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandlder">
		<view class="my-search-box" :style="{'border-radius':radius+'px'}">
			<uni-icons type="search"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		props:{
			bgcolor:{
				type:String,
				default:"#C00000"
			},
			radius:{
				type:Number,
				default:18
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			searchBoxHandlder(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
.my-search-container{
	// background-color: #c00000;
	height: 50px;
	padding: 0 10px;
	display: flex;
	align-items: center;
	.my-search-box{
		height: 36px;
		background-color: #ffffff;
		// border-radius: 15px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.placeholder{
		font-size: 15px;
		margin-left: 5px;
	}
}
</style>