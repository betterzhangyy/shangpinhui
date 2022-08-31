//详细路由规则配置信息
//静态引入一级路由组件（推荐使用路由懒加载）
import Login from '@/pages/Login'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
//引入二级路由组件
import MyOrder from '@/pages/Center/MyOrder'
import GroupOrder from '@/pages/Center/GroupOrder'
export default [
  {
    path: '/center', 
    component: Center,
    meta: { show: true }, //是否展示Footer组件
    children: [
      {
        path: 'myorder',  //vue-router底层默认会带上/
        component: MyOrder
      },
      {
        path: 'grouporder',
        component: GroupOrder
      },
      //路由重定向，默认展示我的订单，重定向到我的订单
      {
        path: '/center',
        redirect: '/center/myorder'
      }
    ]
  },
  {
    path: '/paysuccess', 
    component: PaySuccess,
    meta: { show: true }, //是否展示Footer组件
  },
  {
    path: '/pay', 
    component: Pay,
    meta: { show: true }, //是否展示Footer组件
    beforeEnter: (to, from, next) => {
      //路由只有从trade来的，才能放行
      if(from.path == '/trade') {
        next()
      } else{
        next(false)
      }
    }
  },
  {
    path: '/trade', 
    component: Trade,
    meta: { show: true }, //是否展示Footer组件
    //路由独享守卫
    beforeEnter: (to, from, next) => {
      //用户只能从shopcart跳转才能进来
      if(from.path == '/shopcart') {
        //来自shopcart
        next()
      } else{
        //不是从购物车结算来的，保持不变
        next(false)
      }
    }
  },
  {
    path: '/shopcart', 
    component: ShopCart,
    meta: { show: true }, //是否展示Footer组件
  },
  {
    name: 'addcartsuccess',
    path: '/addcartsuccess', 
    component: AddCartSuccess,
    meta: { show: true }, //是否展示Footer组件
  },
  {
    path: '/detail/:skuId', //点击商品，params传参，给详情组件
    component: Detail,
    meta: { show: true }, //是否展示Footer组件
  },
  {
    path: '/home',
    //路由懒加载：当用户访问的时候，加载对应组件进行展示。
    //动态引入，函数返回值是一个promise对象
    component: () => import('@/pages/Home'),
    meta: { show: true },
  },
  {
    name: 'search',
    path: '/search/:keyword?', //加?，params参数可传可不传
    component: () => import('@/pages/Search'),
    meta: { show: true },
    // props: true     //布尔值写法（是否传递params参数）
    // props: {a: 1}   //对象写法（死数据）
    //函数写法（params传参、query传参）
    /* props: ($route) => {
      return {keyword: $route.params.keyword, k: $route.query.k}
    }  */
  },
  {
    path: '/login',
    component: Login,  
    meta: { show: false },
  },
  {
    path: '/register',
    component: () => import('@/pages/Register'),
    meta: { show: false },
  },
  //默认展示主页，重定向到首页
  {
    path: '/',
    redirect: '/home',
  },
]
