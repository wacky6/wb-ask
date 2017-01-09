<template>
  <div class="tags">
    <el-tag
      v-for="tag in tags"
      class="tag"
      type="primary"
      @click.native="select(tag)"
    >{{tag}}</el-tag>
  </div>
</template>

<script>
export default {
  props: ['tags'],
  methods: {
    select(tag) {
      this.$emit('select', tag)
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
