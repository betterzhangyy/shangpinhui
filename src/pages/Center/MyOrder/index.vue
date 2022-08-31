<template>
  <div class="order-right">
    <div class="order-content">
      <div class="title">
        <h3>我的订单</h3>
      </div>
      <div class="chosetype">
        <table>
          <thead>
            <tr>
              <th width="29%">商品</th>
              <th width="31%">订单详情</th>
              <th width="13%">收货人</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="orders">
        <!-- 每个table都是一条订单 -->
        <table class="order-item" v-for="myOrder in myOrderList.records" :key="myOrder.id">
          <thead>
            <tr>
              <th colspan="5">
                <span class="ordertitle">{{myOrder.createTime}}　订单编号：{{myOrder.outTradeNo}} 
                  <span class="pull-right delete"><img src="../images/delete.png" /></span>
                </span>
              </th>
            </tr>
          </thead>
          <!-- tbody是该条订单购买的所有商品 -->
          <tbody>
            <tr v-for="(orderDetail,index) in myOrder.orderDetailList" :key="orderDetail.id">
              <!-- 图片这块不合并 -->
              <td width="60%">
                <div class="typographic">
                  <img :src="orderDetail.imgUrl" style="width:100px;height:100px"/>
                  <a href="#" class="block-text">{{orderDetail.skuName}}</a>
                  <span>x{{orderDetail.skuNum}}</span>
                  <a href="#" class="service">售后申请</a>
                </div>
              </td>
              <!-- 多少个商品就合并多少列（单元格合并），只需要显示第一条数据即可（遍历重复了）-->
              <td :rowspan="myOrder.orderDetailList.length" v-if="index==0" width="8%" class="center">{{myOrder.consignee}}</td>
              <td :rowspan="myOrder.orderDetailList.length" v-if="index==0" width="13%" class="center">
                <ul class="unstyled">
                  <li>总金额¥{{myOrder.totalAmount}}.00</li>
                  <li>在线支付</li>
                </ul>
              </td>
              <td :rowspan="myOrder.orderDetailList.length" v-if="index==0" width="8%" class="center">
                <a href="#" class="btn">{{myOrder.orderStatusName}}</a>
              </td>
              <td :rowspan="myOrder.orderDetailList.length" v-if="index==0" width="13%" class="center">
                <ul class="unstyled">
                  <li>
                    <a href="mycomment.html" target="_blank">评价|晒单</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="choose-order">
        <!-- 使用全局组件分页器 -->
        <Pagination 
          :pageNo="page" 
          :pageSize="limit" 
          :total="total" 
          :continues="5" 
          @getPageNo="getPageNo"
        />
      </div>
    </div>
    <!--猜你喜欢-->
    <div class="like">
      <h4 class="kt">猜你喜欢</h4>
      <ul class="like-list">
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike01.png" />
          </div>
          <div class="attr">
            <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
          </div>
          <div class="price">
            <em>¥</em>
            <i>3699.00</i>
          </div>
          <div class="commit">已有6人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike02.png" />
          </div>
          <div class="attr">Apple苹果iPhone 6s/6s Plus 16G 64G 128G</div>
          <div class="price">
            <em>¥</em>
            <i>4388.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike03.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike04.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyOrder',
  data() {
    return {
      page: '1',   //当前第几页
      limit: '3',  //每页显示多少条数据
      myOrderList: {},   //存储我的订单列表数据
      total: 0   //一共多少条数据
    }
  },
  mounted() {
    this.getMyOrderList()
  },
  methods: {
    //获取我的订单列表数据
    async getMyOrderList() {
      //结构data中的数据
      let {page, limit} = this
      let result = await this.$API.reqMyOrderList(page, limit)
      if(result.code == 200) {
        //获取我的订单列表成功
        this.myOrderList = result.data
        this.total = result.data.total
      }
    },
    //获取当前页的自定义事件回调
    getPageNo(page) {
      this.page = page  //分页器传递过来的点击的当前页
      //重新获取我的订单列表
      this.getMyOrderList()
    }
  }
}
</script>

<style></style>
