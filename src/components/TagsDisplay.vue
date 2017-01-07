<template>
  <div class="tags">
    <el-tag
      v-for="tag in tags"
      class="tag"
      type="primary"
      @click.native="tagClick(tag)"
    >{{tag}}</el-tag>
  </div>
</template>

<script>
export default {
  props: ['tags', 'click'],
  methods: {
    tagClick(tag) {
      this.$router.push('/tag/'+tag)
    }
  }
}
</script>

<style lang="stylus">
.tags
  .tag
    cursor: pointer
    margin-right: 2ch
    &:last-child
      margin-right: 0
</style>
