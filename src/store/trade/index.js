import { reqOrderInfo, reqUserAddress } from "@/api"

const state = {
  addressInfo: [],  //用户地址信息
  orderInfo: {}  //用户订单信息
}
const mutations = {
  //存储用户地址信息
  GETUSERADDRESS(state, addressInfo) {
    state.addressInfo = addressInfo
  },
  //存储用户订单信息
  GETORDERINFO(state, orderInfo) {
    state.orderInfo = orderInfo
  }
}
const actions = {
  //获取用户地址信息
  async getUserAddress({commit}) {
    let result = await reqUserAddress()
    if(result.code == 200) {
      commit('GETUSERADDRESS', result.data)
      return 'ok'
    } else{
      return Promise.reject(new Error('faile'))
    }
  },
  //获取用户订单信息
  async getOrderInfo({commit}) {
    let result = await reqOrderInfo()
    if(result.code == 200) {
      commit('GETORDERINFO', result.data)
      return 'ok'
    }else {
      return Promise.reject(new Error('faile'))
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