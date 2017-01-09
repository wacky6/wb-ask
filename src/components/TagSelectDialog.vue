<template>
  <el-dialog
    title="选择分类"
    ref="dialog"
    @close="handleClose"
  >
    <tags-display
      v-if="tags && tags.length > 0"
      :tags="tags"
      v-loading="loading"
      @click="select(tag)"
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
  mounted() {
    this.$on('open', () => {
      console.log('opened')
    })
  },
  methods: {
    async fetchTags() {
      this.loading = true
      try {
        let {
          status,
          body
        } = this.$agent.get('/tag')
        if (status === 200) {
          this.tags = body.tags
        }
      }catch(e){
        this.$alert({
          type: 'warning',
          title: '获取标签失败',
          message: e.message
        })
        this.$refs.dialog.close()
      }
      this.loading = false
    },
    open(...args) {
      this.$refs.dialog.open(...args)
      this.fetchTags()
    },
    handleClose() {
      this.$emit('close', this.tag)
    },
    select(tag) {
      this.tag = tag
    }
  }
}
</script>

<style lang="stylus">
</style>
