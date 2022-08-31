import {reqGetCategoryList, reqGetBannerList, reqGetFloorList} from '@/api'
const state = {
  categoryList: [],  //三级菜单
  bannerList: [],  //轮播图
  floorList: [], //Floor组件数据
}
const mutations = {
  //三级菜单
  GETCATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList
  },
  //轮播图
  GETBANNERLIST(state, bannerList) {
    state.bannerList = bannerList
  },
  //floor
  GETFLOORLIST(state, floorList) {
    state.floorList = floorList
  }
}
const actions = {
  //三级菜单
  async getCategoryList({commit}) {
    /**
     * async + await
     * await 后面接 Promise
     * 1.await p1相当于是 p1.then，并且只是成功态的then
     * 2.await 和 then 的区别就是：then还需要传回调进去，但 await 可以直接得到值
     */
    let result = await reqGetCategoryList()  //相当于.then()，直接得到成功的值
    if(result.code === 200) {
      commit('GETCATEGORYLIST', result.data)
    }
  },
  //轮播图
  async getBannerList({commit}) {
    let result = await reqGetBannerList()
    if(result.code === 200) {
      commit('GETBANNERLIST', result.data)
    }
  },
  //floor
  async getFloorList({commit}) {
    let result = await reqGetFloorList()
    if(result.code === 200) {
      commit('GETFLOORLIST', result.data)
    }
  }
}
const getters = {}

export default {
  state, 
  mutations, 
  actions,
  getters
}