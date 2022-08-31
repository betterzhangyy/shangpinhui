<template>
  <div class="pay-main">
    <!-- <el-button type="primary" icon="el-icon-edit">测试</el-button> -->
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{orderId}}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{payInfo.totalFee}}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg"></li>
              <li><img src="./images/pay11.jpg"></li>
              <li><img src="./images/pay12.jpg"></li>
              <li><img src="./images/pay13.jpg"></li>
              <li><img src="./images/pay14.jpg"></li>
              <li><img src="./images/pay15.jpg"></li>
              <li><img src="./images/pay16.jpg"></li>
              <li><img src="./images/pay17.jpg"></li>
              <li><img src="./images/pay18.jpg"></li>
              <li><img src="./images/pay19.jpg"></li>
              <li><img src="./images/pay20.jpg"></li>
              <li><img src="./images/pay21.jpg"></li>
              <li><img src="./images/pay22.jpg"></li>

            </ul>
          </div>

        </div>
        <div class="hr"></div>

        <div class="submit">
          <a class="btn" @click="open">立即支付</a>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //引入生成二维码的模块
  import QRCode from 'qrcode'
  export default {
    name: 'Pay',
    data() {
      return {
        payInfo: {},   //订单支付信息
        timer: null,   //定时器id
        code: ''     //支付成功返回的状态码
      }
    },
    computed: {
      orderId() {
        return this.$route.query.orderId  
      }
    },
    //不能在mounted前面使用async
    mounted() {
      this.getPayInfo()
    }, 
    methods: {
      //根据订单号，获取订单支付信息
      async getPayInfo() {
        let result = await this.$API.reqPayInfo(this.orderId)
        //根据订单号，返回订单支付信息成功
        if(result.code == 200) {
          this.payInfo = result.data
        } else {
          alert(result.message)
        }
      },
      //立即支付回调，二维码弹框
      async open() {
        //利用qrcode生成二维码图片
        let url = await QRCode.toDataURL(this.payInfo.codeUrl)
        //弹出模态框
        this.$alert(`<img src="${url}" />`, '请你微信扫码支付', {
          //是否将 message 属性作为 HTML 片段处理
          dangerouslyUseHTMLString: true,
          //居中布局
          center: true,
          //是否显示取消按钮
          showCancelButton: true,
          //取消按钮的文本内容
          cancelButtonText: '支付遇见问题',
          //确认按钮的文本内容
          confirmButtonText: '已支付成功',
          //是否显示右上角关闭按钮
          showClose: false,
          //MessageBox关闭前的回调
          beforeClose: (type, instance, done) => {
            //type: cancel|confirm
            //instance: 组件实例
            //done: 关闭弹窗的方法
            //点击"支付遇到问题"
            if(type == 'cancel') {
              //清除定时器
              clearInterval(this.timer)
              this.timer = null
              done() //关闭模态框
              alert('请联系管理员豪哥')
            } else{
              //点击"已支付成功"
              //判断是否是成功状态码
              //为了不花钱，这个判断可以注释
              // if(this.code == 200) {
                clearInterval(this.timer)
                this.timer = null
                done() //关闭盒子
                //路由跳转到支付成功页面
                this.$router.push('/paysuccess')
              // }
            }
          }
        })
        if(!this.timer) {
          //点击立即支付（出现二维码），需要不停向服务器发请求，查询用户订单支付的结果
          this.timer = setInterval(async () => {
            //查询用户支付情况
            let result = await this.$API.reqPayStatus(this.orderId)
            //支付成功
            if(result.code == 200) {
              //1.清除定时器
              clearInterval(this.timer)
              this.timer = null //对象有引用关系，会在内存中，变成空对象，会被垃圾回收机制回收
              //2.保存成功状态码，用于后续判断
              this.code = result.code
              //3.关闭模态框
              this.$msgbox.close()
              //4.路由跳转 支付成功组件
              this.$router.push('/paysuccess')
            } else {
              //未支付
              this.code = result.code
            }
          }, 1000)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .pay-main {
    margin-bottom: 20px;

    .pay-container {
      margin: 0 auto;
      width: 1200px;

      a:hover {
        color: #4cb9fc;
      }

      .orange {
        color: #e1251b;
      }

      .money {
        font-size: 18px;
      }

      .zfb {
        color: #e1251b;
        font-weight: 700;
      }

      .checkout-tit {
        padding: 10px;

        .tit-txt {
          font-size: 14px;
          line-height: 21px;

          .success-icon {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url(./images/icon.png) no-repeat 0 0;
          }

          .success-info {
            padding: 0 8px;
            line-height: 30px;
            vertical-align: top;
          }
        }

        .paymark {
          overflow: hidden;
          line-height: 26px;
          text-indent: 38px;

          .fl {
            float: left;
          }

          .fr {
            float: right;

            .lead {
              margin-bottom: 18px;
              font-size: 15px;
              font-weight: 400;
              line-height: 22.5px;
            }
          }
        }
      }

      .checkout-info {
        padding-left: 25px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        border: 2px solid #e1251b;

        h4 {
          margin: 9px 0;
          font-size: 14px;
          line-height: 21px;
          color: #e1251b;
        }

        ol {
          padding-left: 25px;
          list-style-type: decimal;
          line-height: 24px;
          font-size: 14px;
        }

        ul {
          padding-left: 25px;
          list-style-type: disc;
          line-height: 24px;
          font-size: 14px;
        }
      }

      .checkout-steps {
        border: 1px solid #ddd;
        padding: 25px;

        .hr {
          height: 1px;
          background-color: #ddd;
        }

        .step-tit {
          line-height: 36px;
          margin: 15px 0;
        }

        .step-cont {
          margin: 0 10px 12px 20px;

          ul {
            font-size: 0;

            li {
              margin: 2px;
              display: inline-block;
              padding: 5px 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              line-height: 18px;
            }
          }
        }
      }

      .submit {
        text-align: center;

        .btn {
          display: inline-block;
          padding: 15px 45px;
          margin: 15px 0 10px;
          font: 18px "微软雅黑";
          font-weight: 700;
          border-radius: 0;
          background-color: #e1251b;
          border: 1px solid #e1251b;
          color: #fff;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
        }
      }
    }
  }
</style>