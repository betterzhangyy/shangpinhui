import { reqCartList, reqCheckCart, reqDeleteCart } from "@/api"

const state = {
  cartList: [] //购物车列表数据
}
const mutations = {
  GETCARTLIST(state, cartList) {
    state.cartList = cartList
  }
}
const actions = {
  //获取购物车列表数据
  async getCartList({commit}) {
    let result = await reqCartList()
    if(result.code == 200) {
      commit('GETCARTLIST', result.data)
    }
  },
  //删除购物车商品
  async deleteCart({commit}, skuId) {
    let result = await reqDeleteCart(skuId)
    if(result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  //复选框切换商品选中状态
  async checkCart({commit}, {skuId, isChecked}) {
    let result = await reqCheckCart(skuId, isChecked)
    if(result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('filed'))
    }
  },
  //删除购物车中勾选的商品（没有提供相应的删除多条的接口，只能调用一条的接口，一条一条删除）
  deleteCheckedCart({dispatch, getters}) {
    //用于存储每一个的promise对象
    let promiseAll = []
    //遍历购物车列表数据
    getters.cartInfo.cartInfoList.forEach(item => {
      //如果isChecked=1 就派发一个删除购物车商品的action，调用上面的deleteCart
      if(item.isChecked) {
        //每派发一次action，就会返回一个promise对象
        let promise = dispatch('deleteCart', item.skuId)
        promiseAll.push(promise)
      }
    })
    /**
     * 场景：用于判断所有的promise是否都是成功的状态
     * Promise.all([p1, p2, p3]) 返回的是一个返回值为数组|报错的promise对象
     * 如果传入的promise中有一个失败，Promise.all将失败的那个报错信息返回，而不管其它promise是否完成。
     * 如果传入的promise都成功，Promise.all返回一个数组(所有promise对象返回值组成数组，比如上面会返回['ok'])
     */
    return Promise.all(promiseAll)
  },
  //修改全选的商品（没有提供相应的全选的接口，只能调用单条勾选的接口，一条一条勾选）
  allCheckedCard({dispatch, state}, isChecked) {
    //用于存储下面遍历出来的promise对象
    let promiseAll = []
    //遍历购物车中所有数据
    state.cartList[0].cartInfoList.forEach(item => {
      //如果存在与全选状态不同的情况，就需要修改其选中的状态，让其与全选一致
      if(item.isChecked != isChecked) {
        //调用上面的单条勾选的接口，修改其选中的状态，让其与全选一致
        let promise = dispatch('checkCart', {skuId: item.skuId, isChecked})
        promiseAll.push(promise)
      }
    })
    //Promise.all会得出是否都成功
    //都成功，返回返回值为数组的成功的promise对象
    //有一个失败，立即返回返回值为这个失败结果的失败的promise对象
    return Promise.all(promiseAll)
  }
}
const getters = {
  //计算购物车列表
  cartInfo(state) {
    return state.cartList[0] || {}
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}