<template>
  <el-card class="user-info-card" :body-style="bodyStyle">
    <div>财富值：{{user.wealth}}</div>
  </el-card>
</template>

<script>
import {user} from '../global-states.js'

export default {
  props: [ 'body-style' ],
  computed: { user }
}
</script>

<style lang="stylus">
</style>
