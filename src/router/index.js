import Vue from 'vue'
//引入vue-router
import VueRouter from 'vue-router'

//引入路由规则配置
import routes from '@/router/routes'

//引入仓库
import store from '@/store'

//使用vue-router
Vue.use(VueRouter)

//备份push|replace
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

//重写push
VueRouter.prototype.push = function (location, resolve, reject) {
  if(resolve && reject) {
    originPush.call(this, location, resolve, reject)  //指明this是VueRouter实例对象
  } else {
    originPush.call(this, location, ()=>{}, ()=>{})
  }
}

//重写replace
VueRouter.prototype.replace = function (location, resolve, reject) {
  if(resolve && reject) {
    originReplace.call(this, location, resolve, reject)  //指明this是VueRouter实例对象
  } else {
    originReplace.call(this, location, ()=>{}, ()=>{})
  }
}

//创建一个路由实例对象
const router = new VueRouter({
  //配置路由信息
  routes,
  //路由的滚动行为
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    // 始终滚动到顶部
    return { y: 0 }
  },
})

/**
 * 路由守卫：全局守卫、独享守卫、组件内守卫
 * 全局守卫：全局前置守卫、全局后置守卫
 */
//全局前置守卫（路由跳转之前判断）
router.beforeEach(async (to, from, next) => {
  /**
   * to：目标路由
   * from：来自哪个路由
   * next()：放行函数  next()   next(path)
   */
  //获取token
  let token = store.state.user.token
  //获取用户名
  let userInfo = store.state.user.userInfo || {}
  let name = userInfo.name

  //登录成功之后，不能跳转到login
  if(token) {
    //登录
    if(to.path == '/login') {
      //跳转到login
      next('/home')
    } else{
      //除了跳转到login的情况
      if(name) {
        //如果有用户名（有用户信息），直接放行
        next()
      } else {
        //没有用户名（刷新页面），需要重新获取用户名，再进行路由跳转
        try {
          //路由跳转之前，获取用户信息，给Header组件展示用户信息
          await store.dispatch('getUserInfo')
          next()
        } catch (error) {
          //请求服务器，没有获取到数据，token失效了
          //通知服务器删除失效token、本地删除token和用户相关的信息，和退出操作一样
          await store.dispatch('userLogout')
          //跳转到登录页面，重新登录，获取一个新的token
          next('/login')
        }
      }
    }
  } else{
    //未登录 
    //如果要去交易页（trade）、支付页（pay|paysuccess）、个人中心（center|center/myorder），跳转到login
    let toPath = to.path
    if(toPath.includes('/trade') || toPath.includes('/pay') || toPath.includes('/center')) {
      //去login之前需要把没登录想去的地方传递过去，登录之后，就直接跳转到想去的地方
      next(`/login?redirect=${toPath}`)
    } else {
      //其余的home|search|detail|addcartsuccess|shopcart  没登录也可以随便去
      next()
    }
  }
})

export default router