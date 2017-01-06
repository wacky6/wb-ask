<template>
  <div id="app">
    <div class="header">
      <router-link to="/" class="flex-lr logo">
        <img class="logo-img" src="./assets/logo.png">
        <h1 class="title">问答系统</h1>
      </router-link>
      <login-ctrl class="login-ctrl"></login-ctrl>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

import store from './global-states'
import LoginCtrl from './components/LoginCtrl'

export default {
  name: 'app',
  components: { LoginCtrl },
  store,
}
</script>

<style lang="stylus">
#app
  .header
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    .logo, .logo:visited, .logo:hover, .logo:active
      text-decoration: none
      color: inherit
      .logo-img
        max-height: 1.5em
        margin-right: 1ch
      .title
        margin: 0;
</style>
