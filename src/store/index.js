import Vue from 'vue'
import Vuex from 'vuex'
//引入小仓库
import home from '@/store/home'
import search from '@/store/search'
import detail from '@/store/detail'
import shopcart from '@/store/shopcart'
import user from '@/store/user'
import trade from '@/store/trade'

//使用vuex插件
Vue.use(Vuex)

//创建并暴露Store实例
export default new Vuex.Store({
  //模块化开发
  modules: {
    home, 
    search,
    detail,
    shopcart,
    user,
    trade
  }
})