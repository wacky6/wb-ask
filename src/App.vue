<template>
  <div id="app" class="flex-vert">
    <div class="header">
      <router-link to="/" class="flex-horz logo">
        <img class="logo-img" src="./assets/logo.png">
        <h1 class="title">问答系统</h1>
      </router-link>

      <login-ctrl class="login-ctrl">
        <div style="margin-bottom: .5em;">
          <user-info-card
            style="margin-bottom: .5em;"
            :body-style="{ padding: '1em 2ch' }"
          />
          <el-button
            type="warning"
            style="width: 100%;"
            size="small"
            icon="star-on"
            @click="chargeWealth()"
          > 一键氪金 </el-button>
        </div>
      </login-ctrl>

      <!-- 一键氪金对话框 -->
      <el-dialog title="一键氪金" v-model="rechargeDialogVisible" size="full">
        <charge-wealth />
      </el-dialog>
    </div>

    <router-view class="container" />

    <div class="footer">
      <a href="https://github.com/wacky6/wb-ask">wacky6/wb-ask - <span class="powered-by">powered by Vue2</span> - (C) 2017</a>
    </div>
  </div>
</template>

<script>

import store from './global-states'
import LoginCtrl from './components/LoginCtrl'
import UserInfoCard from './components/UserInfoCard'
import ChargeWealth from './ChargeWealth'

export default {
  name: 'app',
  components: { LoginCtrl, UserInfoCard, ChargeWealth },
  store,
  data: () => ({
    rechargeDialogVisible: false
  }),
  methods: {
    chargeWealth() {
      this.rechargeDialogVisible = true
    }
  }
}
</script>

<style lang="stylus">
@import "styles/flex-vert.styl";
html, body
  min-height: 100vh
  width: 100%
  margin: 0
  padding: 0
body
  display: flex
  flex-direction: column
  align-items: stretch
  justify-content: center
#app
  flex-grow: 1
  .header
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    padding: .5em
    .logo, .logo:visited, .logo:hover, .logo:active
      text-decoration: none
      color: inherit
      .logo-img
        max-height: 1.5em
        margin-right: 1ch
      .title
        margin: 0;
  .container
    margin-bottom: 3em
    flex-grow: 1
  .footer
    padding: .2em 0
    font-size: 9px
    text-align: center
    font-family: monospace
    a, a:visited, a:hover
      color: inherit
      text-decoration: none
    h5
      margin: 0
      font-weight: normal
    .powered-by
      color: #8492A6
      font-size: 7px
.el-notification
  z-index: 999999 !important
</style>
