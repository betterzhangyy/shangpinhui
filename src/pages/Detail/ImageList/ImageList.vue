<template>
  <div class="swiper-container" ref="swiperContainer">
    <div class="swiper-wrapper">
      <div 
        class="swiper-slide" 
        v-for="(skuImage, index) in skuImageList" 
        :key="skuImage.id" 
      >
        <img :src="skuImage.imgUrl" 
          :class="{active: skuImage.isDefault == 1}"
          @click="changeActive(skuImage, skuImageList, index)"
        >
      </div>
    </div>
    <div class="swiper-button-next" ref="swiperButtonNext"></div>
    <div class="swiper-button-prev" ref="swiperButtonPrev"></div>
  </div>
</template>

<script>

  import Swiper from 'swiper'
  export default {
    name: "ImageList",
    props: ['skuImageList'],
    watch: {
      //是否服务器的数据已经就位，但页面动态展示数据v-for，可能还没结束
      skuImageList() {
        //修改数据后，更新完DOM后，执行下面回调
        this.$nextTick(()=>{
          new Swiper(this.$refs.swiperContainer, {
            navigation: {
              nextEl: this.$refs.swiperButtonNext,
              prevEl: this.$refs.swiperButtonPrev,
            },
            //同时显示的slides数量
            slidesPerView: 3,
            //定义slides的数量多少为一组
            slidesPerGroup : 1
          })
        })
      }
    },
    methods: {
      changeActive(skuImage, skuImageList, index) {
        //激活项情况是：isDefault=1
        //遍历数组，将前一个激活项取消（设置isDefault=0），设置鼠标点击的图片变为激活项（设置isDefault=1）
        skuImageList.forEach(item => {
          //服务器返回的数据，默认展示哪一张图片
          if(item.isDefault == 1) {
            item.isDefault = 0
            skuImage.isDefault = 1
          }
        })
        //兄弟组件通信，使用$bus，给Zoom组件传递产品id
        this.$bus.$emit('getImageIndex', index)
      }
    },
  }
</script>

<style lang="less" scoped>
  .swiper-container {
    height: 56px;
    width: 412px;
    box-sizing: border-box;
    padding: 0 12px;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;

        &.active {
          border: 2px solid #f60;
          padding: 1px;
        }

        /* &:hover {
          border: 2px solid #f60;
          padding: 1px;
        } */
      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: rgb(235, 235, 235);
      border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;
      &::after {
        font-size: 12px;
      }
    }
  }
</style>