import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from '@/router'
//引入仓库
import store from '@/store'
//三级联动组件/轮播图/分页器--全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'

//引入mockServer--mock数据
import '@/mock/mockServe'

import 'swiper/css/swiper.css'

//引入所有的api接口（不用vuex，直接在组件中操作）
import * as API from '@/api'

//按需引入element-ui组件库
import { Button, MessageBox } from 'element-ui'

//引入表单验证插件
import validate from '@/plugins/validate'

//引入默认加载图片
import loadImage from '@/assets/loading.jpeg'
//引入图片懒加载插件
import VueLazyload from 'vue-lazyload'
//使用插件
Vue.use(VueLazyload, {
  loading: loadImage,  //服务器图片没回来之前，显示默认图片
})

//关闭生产提示
Vue.config.productionTip = false

//注册全局组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
//1.第一种写法
// Vue.component(Button.name, Button)
//2.第二种写法
// Vue.use(Button)
//Message有点特殊，在项目中不能直接使用，由于其他组件都是标签形式的，message需要绑定到vue的原型上才能像官网一样使用
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

new Vue({
  render: h => h(App),
  router,
  store,
  //全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API  //模仿$bus，使所有组件都可以看见（放在原型对象上）
  }
}).$mount('#app')
