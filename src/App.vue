<template>
  <div>
    <Header/>
    <router-view></router-view>
    <Footer v-show="$route.meta.show"/>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: {Header, Footer},
  mounted() {
    //App只会执行一次，home--search切换不需要重新请求
    //通知vuex发请求，获取数据，存于仓库中
    this.$store.dispatch('getCategoryList')
  },
}
</script>

<style>

</style>
