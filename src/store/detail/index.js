import { reqGetGoodsInfo, reqAddOrUpdateCart } from "@/api"
import {getUuidToken} from "@/utils/uuid_token"  //分别暴露的方式暴露的
const state = {
  goodsInfo: {},  //存储产品详情信息
  //存储在仓库中，是因为仓库在入口文件中引入，就执行一次，至于在哪一个小仓库中存储，看情况
  uuid_token: getUuidToken()  //存储临时游客信息
}
const mutations = {
  //操作产品详情信息
  GETGOODSINFO(state, goodsInfo) {
    state.goodsInfo = goodsInfo
  }
}
const actions = {
  //获取产品详情信息
  async getGoodsInfo({commit}, skuId) {
    let result = await reqGetGoodsInfo(skuId)
    if(result.code == 200) {
      commit('GETGOODSINFO', result.data)
    }
  },
  //添加到购物车中，需要发请求给服务器，将数据存储到数据库中，仓库中是不需要存储数据的
  //async函数返回的是Promise对象，返回值的状态就是该返回的Promise对象的状态
  //return 非promise对象|其他数据类型数据  都是成功的promise对象，返回值就是该对象的值
  //return 新的promise
  //return Promise.reject() 就是失败的promise对象
  async addOrUpdateCart({commit}, {skuId, skuNum}) {
    //await promise对象   返回的是promise对象成功的结果
    //await 会阻塞进程，会暂停当前 async function 的执行，等待 Promise 处理完成
    let result = await reqAddOrUpdateCart(skuId, skuNum)
    if(result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  }
}
const getters = {
  //导航路径区域展示信息
  categoryView(state) {
    return state.goodsInfo.categoryView || {}
  },
  //右侧详细商品信息
  skuInfo(state) {
    return state.goodsInfo.skuInfo || {}
  },
  //平台售卖属性
  spuSaleAttrList(state) {
    return state.goodsInfo.spuSaleAttrList || []
  }
}

export default {
  state, 
  mutations,
  actions, 
  getters
}