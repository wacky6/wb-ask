<template>
  <div :class="className" >
    <div class="nickname">{{ user ? user.nickname : '' }}</div>
  </div>
</template>

<script>
export default {
  props: ['user', 'type'],
  computed: {
    className() {
      return {
        'user-display': true,
        'mini': this.type === 'mini'
      }
    }
  }
}
</script>

<style lang="stylus">
.user-display
  .nickname
    text-align: center
    margin: .3em
  &.mini
    display: inline-block
    margin: 0
</style>
