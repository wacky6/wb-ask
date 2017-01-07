<template>
  <div class="user-display">
    <div class="nickname">{{ user ? user.nickname : '' }}</div>
  </div>
</template>

<script>
export default {
  props: ['user']
}
</script>

<style lang="stylus">
.user-display
  .nickname
    text-align: center
    margin: .3em
</style>
