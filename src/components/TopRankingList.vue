<template>
  <div class="top-ranking">
    <h4>排行榜</h4>
    <el-table
      v-loading="loading"
      text="加载中..."
      :data="tableData"
      :row-class-name="getRowClassName"
    >
      <el-table-column prop="nickname" label="用户"/>
      <el-table-column prop="goodanswer" min-width="20" label="采纳数"/>
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
    let {
      status,
      body: { list }
    } = await this.$agent.get('/api/user').query({ condition: 'top', limit: 10 })
    this.loading = false
    if (status === 200)
      this.tableData = list
  }
}
</script>

<style lang="stylus">
</style>
