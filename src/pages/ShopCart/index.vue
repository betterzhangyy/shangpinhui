<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cartInfo in cartInfoList" :key="cartInfo.id">
          <li class="cart-list-con1">
            <input 
              type="checkbox" 
              name="chk_list" 
              :checked="cartInfo.isChecked == 1" 
              @change="checkCart(cartInfo, $event)" 
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl" />
            <div class="item-msg">{{ cartInfo.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cartInfo.cartPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handlerNum('mins', -1, cartInfo)">-</a>
            <input
              autocomplete="off"
              type="text"
              :value="cartInfo.skuNum"
              minnum="1"
              class="itxt"
              @change="handlerNum('inum', $event.target.value * 1, cartInfo)"
            />
            <a href="javascript:void(0)" class="plus" @click="handlerNum('plus', 1, cartInfo)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cartInfo.skuPrice * cartInfo.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a @click="deleteCart(cartInfo)" class="sindelet">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked && cartInfoList.length>0" @change="allCheckedCard"/>
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade" class="sum-btn">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import throttle from 'lodash/throttle'
export default {
  name: 'ShopCart',
  mounted() {
    //从添加购物车组件跳转到购物车组件，初始状态就需要展示购物车列表信息
    this.getCartList()
  },
  methods: {
    getCartList() {
      //派发action，请求服务器数据，动态获取购物车列表数据
      //服务器没有返回数据，是因为你目前既不是正式用户，也不是临时游客，服务器不知如何返回购物车数据
      this.$store.dispatch('getCartList')
    },
    //处理修改购买数量的回调
    /**
     * type: plus加  mins减  inum输入的数字
     * disNum: 产品数量的差量，即改变后的产品数量-原来的产品数量
     * cartInfo: 商品信息
     */
    //防止用户一直点击按钮，使用节流
    handlerNum: throttle(async function (type, disNum, cartInfo) {
      switch (type) {
        case 'plus':
          disNum = 1
          break
        case 'mins':
          //非正常情况，则保持不变
          disNum = cartInfo.skuNum > 1 ? -1 : 0
          break
        case 'inum':
          //非正常情况，则保持不变
          //非数字类型 * 1，一定是NaN
          //输入0或负数
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0
          } else {
            //可能存在小数
            //输入框，传递的参数disNum是变化后的数量，需要减去原来的数量
            disNum = parseInt(disNum) - cartInfo.skuNum
          }
          break
      }
      try {
        //一旦产品数量发生修改，调用接口，重新存储最新的产品信息
        await this.$store.dispatch('addOrUpdateCart', { skuId: cartInfo.skuId, skuNum: disNum })
        //将修改的产品数据成功存到数据库之后，重新获取最新购物车列表数据
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    }, 1000),
    //删除购物车商品
    async deleteCart(cartInfo) {
      try {
        //成功的promise，已经删除商品
        await this.$store.dispatch('deleteCart', cartInfo.skuId)
        //重新请求服务器，获取最新的购物车列表
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
    //修改商品勾选状态
    async checkCart(cartInfo, e) {
      //服务器需要的数据isChecked=1|0（选中|没选中）
      let isChecked = e.target.checked ? '1' : '0'
      try {
        //修改商品选中状态成功
        await this.$store.dispatch('checkCart', {skuId: cartInfo.skuId, isChecked})
        //再次请求服务器，返回最新的购物车列表信息
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
    //删除选中的商品（没有相应的接口，调用只能删除一条商品的接口）
    async deleteCheckedCart() {
      try {
        //等待删除成功的结果，再从服务器重新获取数据
        await this.$store.dispatch('deleteCheckedCart')
        //再次最新的购物车列表数据
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
    //修改商品是否全选的状态（没有提供响应的接口，只能在仓库中调用修改单条勾选商品的接口）
    async allCheckedCard(e) {
      let isChecked = e.target.checked ? '1' : '0'
      try {
        //等待修改全选成功的结果
        await this.$store.dispatch('allCheckedCard', isChecked)
        //修改全选结果之后，需要重新向服务器发送请求更新页面
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    }
  },
  computed: {
    //获取仓库中购物车列表数据
    ...mapGetters(['cartInfo']),
    //对购物车列表数据进行兜底处理
    cartInfoList() {
      return this.cartInfo.cartInfoList || []
    },
    //计算总数
    totalPrice() {
      let sum = 0 //代表总数=单价*数量
      this.cartInfoList.forEach(item => {
        sum += item.cartPrice * item.skuNum
      })
      return sum
    },
    //判断是否全选
    //every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试
    //如果有一个元素不符合，则立即返回false
    //遍历所有元素都符合，则返回true
    isAllChecked() {
      return this.cartInfoList.every(item => item.isChecked == 1)
    },
  },
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
