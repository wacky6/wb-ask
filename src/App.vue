<template>
  <div id="app">
    <h1>
      <img class="logo" src="./assets/logo.png">
      <span class="title">问答系统</span>
    </h1>
    <login-ctrl></login-ctrl>
  </div>
</template>

<script>

import store from './global-states'
import LoginCtrl from './components/LoginCtrl'

export default {
  name: 'app',
  components: { LoginCtrl },
  store,
  async mounted() {
    console.log( await this.$agent.get('/').end() )
  }
}
</script>

<style lang="stylus">
#app
  h1
    display: flex
    flex-direction: row
    align-items: center
    justify-content: flex-start
    .logo
      max-height: 1em
      margin-right: 1ch
  .dashboard
    display: flex
    flex-direction:column

</style>
