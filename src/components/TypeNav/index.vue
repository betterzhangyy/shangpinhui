<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派 -->
      <div @mouseleave="leaveIndex" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- Vue中过渡动画 -->
        <transition name="sort">
         <!-- 三级联动：利用编程式导航+事件委派，实现路由的跳转和传参 -->
          <div class="sort" v-show="show">
            <!-- 事件委派 -->
            <div class="all-sort-list2" @click="goSearch">
              <div class="item" v-for="(c1, index) in categoryList" :key="c1.categoryId" :class="{cur: currentIndex==index}">
                <!-- 一级分类 -->
                <h3 @mouseenter="changeIndex(index)">
                  <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{c1.categoryName}}</a>
                </h3>
                <!-- 二三级分类 -->
                <div class="item-list clearfix" :style="{display: currentIndex==index ? 'block' : 'none'}">
                  <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                    <dl class="fore">
                      <dt>
                        <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{c2.categoryName}}</a>
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{c3.categoryName}}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  //按需引入
  import throttle from 'lodash/throttle'
  export default {
    name: "TypeNav",
    data() {
      return {
        currentIndex: -1,  //用于判断是否是鼠标移入的元素
        show: true
      }
    },
    methods: {
      //鼠标移入保存索引，用于判断是否是当前移入的状态
      //触发频繁，可以使用节流，在50ms只执行一次的函数
      changeIndex: throttle(function (index) {
        this.currentIndex = index
      }, 50),
      
      //鼠标移出事件
      leaveIndex() {
        this.currentIndex = -1
        //search组件中，才需要控制三级列表的显示与隐藏
        if(this.$route.path != '/home') {
          this.show = false
        }
      },

      //鼠标移入事件，控制search组件中，三级列表的显示与隐藏
      enterShow() {
        if(this.$route.path != '/home') {
          this.show = true
        }  
      },

      //三级分类路由跳转
      goSearch(event) {
        let element = event.target
        let {categoryname, category1id, category2id, category3id} = element.dataset  //获取当前元素的属性
        //1.识别是a标签
        if(categoryname) {
          //2.传参
          let location = {name: 'search'}
          let query = {categoryName: categoryname}
          if(category1id) {
            query.category1Id = category1id
          } else if(category2id) {
            query.category2Id = category2id
          } else {
            query.category3Id = category3id
          }
          //3.整合路由参数
          location.query = query
          location.params = this.$route.params
          this.$router.push(location)
        }
      }
    },  
    mounted() {
      //home--search路由切换，会经过卸载--挂载的过程
      //控制三级列表显示与隐藏
      if(this.$route.path != '/home') {
        this.show = false
      }
    },
    computed: {
      ...mapState({
        //state是大仓库中的数据
        categoryList: state => state.home.categoryList
      })
    }
  }
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

         /*  &:hover {
            .item-list {
              display: block;
            }
          } */
        }
        
        .cur {
          background-color: skyblue;
        }
      }
    }

    // 动画进入起点
    .sort-enter {
      height: 0px;
    }

    //动画进入重点
    .sort-enter-to {
      height: 461px;
    }

    //动画持续时间、速度
    .sort-enter-active {
      transition: height .5s linear;
    }
  }
}
</style>