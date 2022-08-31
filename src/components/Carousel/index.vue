<template>
  <div class="swiper-container" ref="swiperContainer">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carousel in carouselList" :key="carousel.id">
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination" ref="swiperPagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev" ref="swiperButtonPrev"></div>
    <div class="swiper-button-next" ref="swiperButtonNext"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
export default {
  name: 'Carousel',
  props: ['carouselList'],
  watch: {
    carouselList: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          new Swiper(this.$refs.swiperContainer, {
            loop: true,
            pagination: {
              el: this.$refs.swiperPagination,
              clickable: true,
            },
            navigation: {
              nextEl: this.$refs.swiperButtonNext,
              prevEl: this.$refs.swiperButtonPrev,
            }
          })
        })
      }
    }
  }
}
</script>
