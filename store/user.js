export default {
	//为当前模块开启命名空间
	namespaced: true,

	//模块的state数据
	state: () => ({
		//保存用户地址
		address: JSON.parse(uni.getStorageSync('address')||'{}'),
		//保存用户token
		token:uni.getStorageSync('token')|| '',
		//用户信息对象
		userinfo:JSON.parse(uni.getStorageSync('userinfo')||'{}'),
		//重定向的object对象
		redirectInfo:null
	}),

	//模块的mutations方法
	mutations: {
		updateAddress(state,address){
			state.address=address;
			this.commit('m_user/saveAddressToStorage');
		},
		//将地址数据持久化存储
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address));
		},
		
		//将用户信息数据持久化存储
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo));
		},
		//更新用户基本信息
		updateUserInfo(state,userinfo){
			state.userinfo=userinfo;
			this.commit('m_user/saveUserInfoToStorage');
		},
		//将用户信息token数据持久化存储
		saveTokenToStorage(state) {
			uni.setStorageSync('token', JSON.stringify(state.token));
		},
		//更新用户token
		updateToken(state,token){
			state.token=token;
			this.commit('m_user/saveTokenToStorage');
		},
		updateRedirectInfo(state,info){
			state.redirectInfo=info
		}
		

	},

	//模块的getters属性
	getters: {
		addstr(state){
			if(!state.address.provinceName) return '';
			return state.address.provinceName+state.address.cityName+state.address.countyName+state.address.detailInfo
		}
	}
}