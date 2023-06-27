import {
	mapGetters
} from 'vuex'

export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	onShow() {
		this.setBadge();
	},
	watch:{
		total(){
			this.setBadge();
		}
	},
	methods:{
		setBadge(){
			uni.setTabBarBadge({
				index:2,//索引
				text:this.total+''//只能是字符串，不能是数字
			})
		}
	}

}