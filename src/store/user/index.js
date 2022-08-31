//登录和注册的小仓库
import { reqGetCode, reqLogout, reqUserInfo, reqUserLogin, reqUserRegister } from "@/api"
import { getToken, removeToken, setToken } from "@/utils/token"

const state = {
  code: '',  //验证码
  token: getToken(),  //获取本地存储的token
  userInfo: {},  //用户信息
}
const mutations = {
  //存储验证码
  GETCODE(state, code) {
    state.code = code
  },
  //用户登录，存储token
  USERLOGIN(state, token) {
    state.token = token  //首次存储有值，后面请求头中token，直接从state中取本地存储的token
  },
  //获取用户信息，存储于仓库中
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
  //清除本地存储的token、用户数据
  CLEAR(state) {
    state.token = ''  //这是初始化的时候存储的
    state.userInfo = {}
    removeToken()  //清除localStorage存储的
  }
}
const actions = {
  //获取验证码
  async getCode({commit}, phone) {
   let result = await reqGetCode(phone)
   if(result.code == 200) {
    commit('GETCODE', result.data)
    return 'ok'
   } else{
    return Promise.reject(new Error('faile'))
   }
  },
  //用户注册（不需要三连环，是将用户信息存到数据库中）
  async userRegister({commit}, user) {
    let result = await reqUserRegister(user)
    //需要将结果告知，才能跳转到登录页面
    if(result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  //用户登录
  async userLogin({commit}, user) {
    let result = await reqUserLogin(user)
    if(result.code == 200) {
      //用户信息核对正确，服务器会生成一个用户的唯一标识符token，返回给前端
      //以后用户需要永久存储这个token，拿着这个token，找服务器要用户信息
      commit('USERLOGIN', result.data.token)
      //永久存储token（localStorage）
      setToken(result.data.token)
      //需要返回成功或是失败的结果，告知用户
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  //获取用户信息（需要在请求头中带token，给服务器校验）
  async getUserInfo({commit}) {
    let result = await reqUserInfo()
    if(result.code) {
      commit('GETUSERINFO', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  //退出登录，告知服务器需要清除token
  async userLogout({commit}) {
    let result = await reqLogout()
    if(result.code == 200) {
      //还需要清除本地的一些用户信息和localStorage
      commit('CLEAR')
      return 'ok'
    } else{
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