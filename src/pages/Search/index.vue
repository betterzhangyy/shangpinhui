<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 三级分类面包屑 -->
            <li class="with-x" v-show="searchParams.categoryName">{{searchParams.categoryName}}<i @click="removeCategoryName">×</i></li>
            <!-- 关键字面包屑 -->
            <li class="with-x" v-show="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyword">×</i></li>
            <!-- 品牌面包屑 -->
            <li class="with-x" v-show="searchParams.trademark">{{searchParams.trademark.split(":")[1]}}<i @click="removeTrademark">×</i></li>
            <!-- 平台售卖属性面包屑 -->
            <li class="with-x" v-for="(props, index) in searchParams.props" :key="index">{{props.split(':')[1]}}<i @click="removeProps(index)">×</i></li>
          </ul>
        </div>

        <!--selector 接收子组件参数---自定义事件-->
        <SearchSelector @getTrademarkInfo="getTrademarkInfo" @getAttrsInfo="getAttrsInfo"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 综合和价格排序 -->
              <ul class="sui-nav">
                <li :class="{active: isOne}" @click="sort(1)">
                  <a>综合<span v-show="isOne" class="iconfont" :class="{'icon-up': isAsc, 'icon-down': isDesc}"></span></a>
                </li>
                <li :class="{active: isTwo}" @click="sort(2)">
                  <a>价格<span v-show="isTwo" class="iconfont" :class="{'icon-up': isAsc, 'icon-down': isDesc}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品分类 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 点击商品的图片，路由跳转到详情组件 需要带商品id params传参 -->
                    <router-link :to="`/detail/${goods.id}`">
                      <!-- 使用图片懒加载（服务器数据没回来之前，显示默认图片） -->
                      <img v-lazy="goods.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ goods.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{
                      goods.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器组件--全局组件 自定义事件，需要分页器组件传递当前页参数-->
          <!-- props传参默认是只读的 -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5" @getPageNo="getPageNo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SearchSelector from './SearchSelector/SearchSelector'
export default {
  name: 'Search',
  data() {
    return {
      searchParams: {
        category1Id: '', //一级分类的id
        category2Id: '', //二级分类的id
        category3Id: '', //三级分类的id
        categoryName: '', //商品的名字
        keyword: '', //用户搜索的关键字
        props: [], //商品属性的搜索条件
        trademark: '', //品牌的搜索条件
        order: '1:desc', //排序的参数 【默认初始值:1:desc】
        pageNo: 1, //当前分页器的页码  【默认初始值:1】
        pageSize: 10 //代表当前一页显示几条数据 【默认初始值:10】
      }
    }
  },
  components: {SearchSelector},
  //向服务器发请求之前，搜索参数
  beforeMount() {
    //合并对象，后面2个对象的值会替换前面
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  mounted() {
     //初次展示获取数据
    this.getSearchData()
  },
  computed: {
    ...mapGetters(['goodsList']),
    //分页器的总数
    ...mapState({
      total: state => state.search.searchList.total
    }),
    //排序的参数是否有1
    isOne() {
      return this.searchParams.order.includes('1')
    }, 
    //排序的参数是否有2
    isTwo() {
      return this.searchParams.order.includes('2')
    },
    isAsc() {
      return this.searchParams.order.includes('asc')
    },
    isDesc() {
      return this.searchParams.order.includes('desc')
    }
  },
  methods: {
    //发请求获取数据
    getSearchData() {
      this.$store.dispatch('getSearchList', this.searchParams)
    },
    //移除面包屑中三级菜单
    removeCategoryName() {
      //属性值为空字符串，没必要把该属性传给服务器，设置为undefined，则不会向服务器传递该属性
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      this.searchParams.categoryName = undefined
      this.getSearchData()
      //query参数不要，params参数是关键字需要
      //修改地址，路由自己跳转自己
      this.$router.push({name: 'search', params: this.$route.params})
    },
    //移除面包屑中关键字
    removeKeyword() {
      this.searchParams.keyword = undefined
      this.getSearchData()
      //通知Header组件，将输入框中的关键字置空
      this.$bus.$emit('clearKeyword')

      //params参数不要，query参数是三级菜单需要
      //修改地址，路由自己跳转自己
      this.$router.push({name: 'search', query: this.$route.query})
    },
    //接收品牌参数的自定义事件的回调 格式："ID: 品牌名称"
    getTrademarkInfo(trademark) {
      this.searchParams.trademark = `${trademark.tmId}: ${trademark.tmName}`
      this.getSearchData()
    },
    //移除面包屑中品牌
    removeTrademark() {
      //这里不能使用undefined，上面使用split，会报错
      this.searchParams.trademark = ''
      this.getSearchData()
    },
    //接收平台售卖属性参数的自定义事件的回调  格式：["属性ID:属性值:属性名"]
    getAttrsInfo(attrs, attrValue) {
      let attrsInfo = `${attrs.attrId}: ${attrValue}: ${attrs.attrName}`
      //数组去重
      if(!this.searchParams.props.includes(attrsInfo)) {
        this.searchParams.props.push(attrsInfo)
        this.getSearchData()
      }
    },
    //移除平台售卖属性
    removeProps(index) {
      this.searchParams.props.splice(index, 1)
      this.getSearchData()
    },
    //接收排序参数的回调
    // 1|2标记flag，到底谁是高亮状态
    // asc|desc排序sortType，到底是升序还是降序
    sort(flag) {
      let originFlag = this.searchParams.order.split(':')[0]
      let originSortType = this.searchParams.order.split(':')[1]
      let newOrder = ''
      //高亮的判断，多次点击是不是同一个按钮
      if(flag == originFlag) {
        //修改排序的类型，降序改为升序，升序改为降序
        newOrder = `${originFlag}:${originSortType == 'desc' ? 'asc' : 'desc'}`
      } else{
        //不是高亮的初始状态，点击不是同一个按钮
        newOrder = `${flag}:desc`
      }
      //整合参数
      this.searchParams.order = newOrder
      this.getSearchData()
    },
    //获取当前页参数的自定义事件的回调
    getPageNo(pageNo) {
      this.searchParams.pageNo = pageNo
      //需要重新发请求
      this.getSearchData()
    }
  },
  watch: {
    //$route是组件身上的一个属性，watch配置对象中可以直接访问到，函数中需要使用this.$route
    //监听Search组件中路由的变化，动态获取数据
    $route() {
      //整合参数
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
      this.getSearchData()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
