<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">上一页</button>
    <button v-if="startNumAndEndNum.start > 1" @click="$emit('getPageNo', 1)">1</button>
    <button v-if="startNumAndEndNum.start > 2">···</button>

    <!-- 中间连续页码数 -->
    <button 
      @click="$emit('getPageNo', page)" 
      v-for="page in startNumAndEndNum.end" 
      :key="page" v-show="page >= startNumAndEndNum.start"
      :class="{active: page == pageNo}"
    >
      {{ page }}
    </button>

    <button v-if="startNumAndEndNum.end < totalPage - 1">···</button>
    <button v-if="startNumAndEndNum.end < totalPage" @click="$emit('getPageNo', totalPage)">{{ totalPage }}</button>
    <button :disabled="pageNo == totalPage" @click="$emit('getPageNo', pageNo + 1)">下一页</button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    //计算总页数
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    //计算连续页码数的开始第一个数和最后一个数 continues=5
    startNumAndEndNum() {
      const { pageNo, continues, totalPage } = this
      let start = 0,
        end = 0
      //1.非正常情况：总页数不足continues
      if (totalPage < continues) {
        start = 1
        end = totalPage
      } else {
        //正常情况：总页数大于continues
        start = pageNo - (continues - 1) / 2
        end = pageNo + (continues - 1) / 2
        //2.非正常情况：start出现0|负数
        //当前页2   0 1 2 3 4
        //当前页1  -1 0 1 2 3
        if (start < 1) {
          start = 1
          end = continues
        }
        //3.非正常情况：end超出totalPage
        //当前页31   29 30 31 32 33
        //当前页30   28 29 30 31 32
        //当前页29   27 28 29 30 31
        if (end > totalPage) {
          start = totalPage - continues + 1
          end = totalPage
        }
      }
      return { start, end }
    },
  },
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
  .active {
    background-color: skyblue;
  }
}
</style>
