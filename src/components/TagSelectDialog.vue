<template>
  <el-dialog
    title="选择分类"
    ref="dialog"
    @close="close()"
  >
    <tags-display
      v-if="tags && tags.length > 0"
      :tags="tags"
      v-loading="loading"
      @select="gotoTag"
    />
    <h5 v-else>
      暂无标签
    </h5>
  </el-dialog>
</template>

<script>
import TagsDisplay from './TagsDisplay'
export default {
  components: { TagsDisplay },
  data: () => ({
    loading: false,
    tags: [],
    tag: null
  }),
  created() {
    // this.$on('open', () => {
    //   console.log('opened')
    // })
  },
  methods: {
    async fetchTags() {
      this.loading = true
      try {
        let {
          status,
          body
        } = await this.$agent.get('/api/tag')
        if (status === 200) {
          this.tags = body.list
        }
      }catch(e){
        this.$notify({
          type: 'warning',
          title: '获取标签失败',
          message: e.message
        })
        this.$refs.dialog.close()
      }
      this.loading = false
    },
    open() {
      this.$refs.dialog.open()
      this.fetchTags()
    },
    close() {
      this.$refs.dialog.close()
      this.$emit('close', this.tag)
    },
    gotoTag(tag) {
      this.tag = tag
      this.close()
    }
  }
}
</script>

<style lang="stylus">
</style>
