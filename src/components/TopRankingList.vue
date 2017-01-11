<template>
  <div class="top-ranking">
    <h4>排行榜</h4>
    <el-table
      v-loading="loading"
      text="加载中..."
      :data="tableData"
      :row-class-name="getRowClassName"
      :fit="true"
    >
      <el-table-column width="120" prop="nickname" class-name="nickname" label="用户"/>
      <el-table-column prop="goodanswer" class-name="goodanswer" label="采纳数"/>
    </el-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    tableData: [],
    loading: true
  }),
  methods: {
    getRowClassName(r, idx) {
      switch (idx) {
      case 1: return 'rank-1'
      case 2: return 'rank-2'
      case 3: return 'rank-3'
      default: return ''
      }
    }
  },
  async mounted() {
    this.loading = true
    try {
        let {
          status,
          body: { list }
        } = await this.$agent.get('/api/user').query({ condition: 'top', limit: 10 })
        if (status === 200)
          this.tableData = list
    } catch(e) {
        this.tableData = []
    }
    this.loading = false
  }
}
</script>

<style lang="stylus">
.top-ranking
  .nickname
    .cell
      text-overflow: ellipsis;
      white-space: pre
</style>
