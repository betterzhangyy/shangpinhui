//search模块的小仓库
import { reqSearchList } from "@/api"

const state = {
  searchList: {}  //搜索列表
}
const mutations = {
  //搜索列表
  GETSEARCHLIST(state, searchList) {
    state.searchList = searchList
  }
}
const actions = {
  //搜索列表
  async getSearchList({commit}, params = {}) {
    let result = await reqSearchList(params)
    if(result.code == 200) {
      commit('GETSEARCHLIST', result.data)
    }
  }
}

//计算属性，简化仓库中的数据而生
const getters = {
  //如果断网或是网速很慢，服务器没有返回数据，则state.searchList.attrsList值是undefined，组件读取遍历时会报错
  attrsList(state) {
    return state.searchList.attrsList || []
  },
  goodsList(state) {
    return state.searchList.goodsList || []
  },
  trademarkList(state) {
    return state.searchList.trademarkList || []
  }
}

export default {
  state, 
  mutations, 
  actions,
  getters
}