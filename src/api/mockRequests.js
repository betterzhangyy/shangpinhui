//对axios进行二次封装
import axios from 'axios'
//引入进度条模块及其样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//创建一个axios实例对象---requests
let requests = axios.create({
  baseURL: '/mock',  
  timeout: 5000     
})

//请求拦截器
requests.interceptors.request.use((config) => {
  //在发送请求之前做些什么
  nprogress.start()  //开始进度条
  return config
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