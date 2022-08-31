//对API进行统一管理
import requests from "./requests"
import mockRequests from './mockRequests'

//三级分类菜单请求
export const reqGetCategoryList = () => requests({url: '/product/getBaseCategoryList', method: 'get'})

//轮播图请求 mock数据
export const reqGetBannerList = () => mockRequests({url: '/banner', method: 'get'})

//Floor组件 mock数据
export const reqGetFloorList = () => mockRequests.get('/floor')

//Search组件发送请求 params至少需要一个{}
export const reqSearchList = (params) => requests({url: '/list', method: 'post', data: params})

//Detail组件发送请求 get请求 /api/item/{ skuId }
export const reqGetGoodsInfo = (skuId) => requests({url: `/item/${ skuId }`, method: 'get'})

//添加到购物车 /api/cart/addToCart/{ skuId }/{ skuNum } post氢气
export const reqAddOrUpdateCart = (skuId, skuNum) => requests({url: `/cart/addToCart/${ skuId }/${ skuNum }`, method: 'post'})

//获取购物车列表数据 /api/cart/cartList Get请求
export const reqCartList = () => requests({url: '/cart/cartList', method: 'get'})

//删除购物车商品  /api/cart/deleteCart/{skuId} DELETE请求
export const reqDeleteCart = (skuId) => requests({url: `/cart/deleteCart/${skuId}`, method: 'delete'})

//购物车组件中复选框切换商品选中状态 /api/cart/checkCart/{skuID}/{isChecked} Get请求
export const reqCheckCart = (skuId, isChecked) => requests({url: `/cart/checkCart/${skuId}/${isChecked}`})

//获取验证码 /api/user/passport/sendCode/{phone} Get请求
export const reqGetCode = (phone) => requests({url: `/user/passport/sendCode/${phone}`, method: 'get'})

//注册用户 /api/user/passport/register  POST请求
export const reqUserRegister = (data) => requests({url: '/user/passport/register', method: 'post', data})

//用户登录 /api/user/passport/login POST请求 phone password
export const reqUserLogin = (data) => requests({url: '/user/passport/login', method: 'post', data})

//获取用户信息 /api/user/passport/auth/getUserInfo Get请求
export const reqUserInfo = () => requests({url: '/user/passport/auth/getUserInfo', method: 'get'})

//退出登录 /api/user/passport/logout GET请求
export const reqLogout = () => requests({url: '/user/passport/logout', method: 'get'})

//获取用户地址信息 /api/user/userAddress/auth/findUserAddressList Get请求
export const reqUserAddress = () => requests({url: '/user/userAddress/auth/findUserAddressList', method: 'get'})

//获取订单交易页信息  /api/order/auth/trade Get请求
export const reqOrderInfo = () => requests({url: '/order/auth/trade', method: 'get'})

//提交订单 /api/order/auth/submitOrder?tradeNo={tradeNo} POST请求
export const reqSubmitOrder = (tradeNo, data) => requests({url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,data, method: 'post'})

//获取订单支付信息 /api/payment/weixin/createNative/{orderId} GET请求
export const reqPayInfo = (orderId) => requests({url: `/payment/weixin/createNative/${orderId}`, method: 'get'})

//查询订单支付的状态 /api/payment/weixin/queryPayStatus/{orderId}  GET请求
export const reqPayStatus = (orderId) => requests({url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get'})

//获取我的订单列表 /api/order/auth/{page}/{limit} GET请求
export const reqMyOrderList= (page, limit) => requests({url: `/order/auth/${page}/${limit}`, method: 'get'})