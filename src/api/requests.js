//对axios进行二次封装
import axios from 'axios'
//引入进度条模块及其样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//引入仓库
import store from '@/store'
//创建一个axios实例对象---requests
let requests = axios.create({
  baseURL: '/api',  //基础路径,发请求URL携带api【发现:真实服务器接口都携带/api】
  timeout: 5000     //超时的设置
})

//请求拦截器
requests.interceptors.request.use((config) => {
  //在发送请求之前做些什么
  /**
   * 每一次请求数据都需要验证这个用户的身份，就不要在每一次的请求后面带参数了，
   * 直接设置在请求拦截器的请求头中，每一次请求都会带上这个配置
   * token: d90aa16f24d04c7d882051412f9ec45b   后台生成
   * userTempId: b2f79046-7ee6-4dbf-88d0-725b1045460b 前台生成（未登录用户生成的临时ID）
   */
  //需要验证用户身份，获取仓库中的state中uuid_token
  //userTempId这个参数，需要和后端统一
  let userTempId = store.state.detail.uuid_token
  if(userTempId) {
    config.headers.userTempId = userTempId
  }
  //需要携带用户的token，当获取用户信息时，需要校验用户的身份
  if(store.state.user.token) {
    config.headers.token = store.state.user.token
  }

  nprogress.start()  //开始进度条
  return config  //config包含所有的请求信息
})

//响应拦截器
requests.interceptors.response.use((res) => {
  //对响应数据做些什么
  nprogress.done()   //结束进度条
  return res.data
}, (error) => {
  return Promise.reject(error)
})

export default requests