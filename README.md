## vue模块化开发流程
* 书写静态页面 + 静态组件拆分
* 发请求（API）
* vuex（三连环)
* 组件获取仓库数据，动态展示数据（可能存在服务器返回数据延迟，需要做兜底值处理）
## vue-router
* 是一个插件
* 创建一个路由器实例对象，并配置路由信息
* 在入口文件中注册
### 路由传参
* params传参需要占位符，对象写法配置name
* params传参可传可不传，使用 ?
* params传参有' '，使用undefined解决
* 路由可以使用props传参（常用函数写法）
### 编程式导航路由跳转异常
* 问题：Vue路由当你重复传相同参数时,控制台就会报:NavigationDuplicated
  解决：push|replace返回的是Promise对象，需要执行成功的回调或是失败的回调，重写VueRouter原型对象上的push|replace方法，添加成功的回调和失败的回调
### 路由监听
* 场景：根据路由参数的不同（查询条件），需要频繁的向服务器请求数据，动态展示页面
* 数据需要在Search组件中展示，就在该组件中请求数据，Home组件则通过路由跳转传参，在Search组件中整合所有查询条件，通过watch监听路由的变化，向服务器发送请求，动态获取数据展示
* 浏览器路由地址修改：让Search组件路由自己跳转自己
* 给服务器携带的参数：如果数值为undefined，向服务器发请求的时候，参数不会携带给服务器
## axios二次封装
* 创建一个axios实例对象
* 设置请求拦截器、响应拦截器
* 使用async + await
await 后面接 Promise
  1、await p1相当于是 p1.then，并且只是成功态的then
  2、await 和 then 的区别就是：then还需要传回调进去，但 await 可以直接得到值
## nprogress进度条
* 引入nprogress及其样式
* start()  done()
## vuex
* vuex存储不是持久化的，刷新页面，所有变量内存都会被释放，需要重新赋值
* 是一个插件
* 创建一个仓库实例对象，并配置state、actions、mutations、getters、modules
* 在入口文件中注册
### vuex工作流程
* 组件中 
读取state-->...mapState() 
派发actions-->...mapActions()
提交mutations-->...mapMutations()   
* 仓库中
state：存数据
actions：处理业务逻辑、异步，commit()
mutations：操作state数据的唯一途径
* 模块化开发
一个大仓库，分为多个小仓库进行管理
* 注意：暴露数据接口，组件中派发action，actions中异步请求获取数据，提交mutations储存数据
## 防抖与节流（Lodash工具库）
* 防抖：如果连续快速的触发，在规定的时间之后，只会执行最后一次，使用debounce
* 节流：连续触发事件，但是在n秒中只执行一次的函数。节流会稀释函数的执行频率，使用throttle
* 区别：防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行
## mockjs模拟数据 
* 创建mock文件夹
* 准备JSON格式数据的文件
* 创建mockServe.js，使用方法Mock.mock(地址, 数据)
* 入口文件引入
## Swiper轮播图（需要数据、结构都完整）
* mounted：如果数据已经获取到，则创建swiper实例可以直接放在mounted中
* watch+nextTick使用场景：动态渲染页面（异步请求获取数据，页面展示）
* watch：监听异步数据已经获取到
* nextTick：将动态数据渲染到页面之后，执行回调，才能获取到真实DOM
* nextTick官方解释：在下次DOM更新, 循环结束之后，执行延迟回调。在 修改数据之后 立即使用这个方法，获取更新后的DOM。
## 本地存储
* 适用场景：路由跳转不好传递对象类型的数据，不需要跟服务器打交道，可以使用本地存储
* HTML5新增的本地存储和会话存储
* 存储的类型只能是字符串，需要转换
* localStorage永久保存，最大是5M（存储在电脑硬盘），少用
* sessionStorage关闭浏览器就不会保存了，一次会话结束
## 临时游客（uuid+localStorage）
* 在utils中，新建一个模块，暴露一个函数（功能：只生成一次的uuid，利用localStorage）
* 存储于仓库中（因为仓库是在入口文件中注册，需要在程序最开始时执行）
* 请求拦截器中添加一个headers的属性，后面的每次请求都会拥有headers中的这个属性（都需要身份验证），每次请求后面带身份属性很麻烦，所以放置在请求头中
## 配置路径别名
* 在jsconfig.json，配置src路径别名为@
* @代表src路径，在js文件中可以直接使用
* 在组件的style中，需要使用~@
## token令牌
* token：用户登录成功后，服务端返回的一个随机字符串，客户端只需带上这个token前来请求数据即可，无需再次带上用户名和密码。相当于临时身份卡
* vuex三连环保存token（一刷新就没，还没永久保存）
* 在utils中，新建一个模块，暴露2个函数（功能：永久存储token和获取本地存储的token，利用localStorage）
* action中调用保存接口，tate中调用获取接口
* 为什么要将localStorage放到vuex中进行维护？
vuex是存储在内存中的（读取速度快），localStorage是存储在硬盘中的（读取速度慢）
* token注意点：
1.登录成功，下发token（本地、服务器都需存储）
2.退出登录，删除token（本地、服务器都需要删除）
## 路由守卫
* 全局守卫（前置守卫、后置守卫）
* 独享守卫
* 组件内守卫
* 项目中所有路由：register login home search detail （addcartsuccess shopcart） trade （pay paysuccess） center
* 登录（token）情况分析：
1.不能去login 
2.发请求获取用户名（Header组件需要展示），可能存在token过期，则需要删除
* 未登录情况分析：
1.不能去trade|pay|paysuccess|center
放行指定跳转到的路由，如：next(`/login?redirect=${toPath}`)
query参数redirect有值（用户有想去的地方），登录之后就跳转到该路由
query参数为undefined（用户直接点击登录），登录之后就跳转到首页
* 路由独享守卫：shopcart-->trade-->pay-->paysuccess
trade只能是从shopcart路由进来，以此类推
## element-ui组件库
## qrcode生成二维码
## vue-lazyload图片懒加载
## vee-validate表单验证
## 项目的性能优化手段有哪些？
* v-if|v-show，尽可能采用v-show
* 按需引入【lodash、elementUI】
* 防抖与节流
* 路由懒加载：当用户访问的时候，加载对应组件进行展示
## 事件
* 在dom元素上绑定的事件，触发的是dom的原生事件
* 在组件上绑定的事件，触发的是自定义事件，需要用$emit来触发