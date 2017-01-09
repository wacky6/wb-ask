<template>
  <div class="login-ctrl">
    <!-- Login Popover -->
    <el-popover
      ref="popover-login"
      v-model="loginPopoverVisible"
      popper-class="popover-login"
    >
      <form>
        <form-field name="邮箱">
          <el-input
            class="field-input"
            v-model="loginUsername"
            type="text"
            placeholder="邮箱"
            autofocus
            :disabled="busy"
          />
        </form-field>

        <form-field name="密码">
          <el-input
            class="field-input"
            v-model="loginPassword"
            type="password"
            placeholder="密码"
            :disabled="busy"
          >
        </form-field>

        <div class="controls">
          <el-button
            class="btn login"
            type="success"
            icon="check"
            :loading="busy"
            :disabled="!valid"
            trigger="click"
            placement="down"
            @click="login()"
          > 登录 </el-button>
        </div>
        <div class="alert-wrap flex-horz" v-if="loginError">
          <el-alert class="login-alert" type="warning" title="用户名或密码不正确" :closable="false"/>
        </div>
      </form>
    </el-popover>

    <!-- Menu / State Popover -->
    <el-popover
      ref="popover-menu"
      v-model="menuPopoverVisible"
      trigger="click"
      placement="bottom"
      popper-class="popover-menu"
    >
      <slot></slot>
      <el-button
        type="danger"
        icon="close"
        style="width: 100%;"
        size="small"
        @click="logout()"
      > 退出登录 </el-button>
    </el-popover>

    <div class="state">
      <div v-show="loggedOn" class="flex-vert">
        <el-button
          class="nickname"
          v-popover:popover-menu
          type="info"
          :plain="true"
        > {{user.nickname}} </el-button>
      </div>

      <div v-show="!loggedOn">
        <el-button
          v-show="!loggedOn"
          v-popover:popover-login
          placement="down"
          icon="information"
          type="primary"
        > 登录 </el-button>
        <el-button
          class="btn register"
          type="info"
          icon="plus"
          :loading="busy"
          :disabled="loggedOn"
          @click="$router.push('/register')"
        > 注册 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import FormField from './FormField.vue'
import {user, loggedOn} from '../global-states.js'

export default {
  name: 'login-ctrl',
  components: { FormField },
  data: ()=>({
    loginUsername: null,
    loginPassword: null,
    loginPopoverVisible: false,
    loginError: null,
    menuPopoverVisible: false,
    busy: false
  }),
  computed: {
    user, loggedOn,
    loginErrorPopoverVisible() { return Boolean(this.loginError) },
    valid() { return this.loginUsername && this.loginPassword }
  },
  methods: {
    async login() {
      this.busy = true
      this.loginError = null

      if (this.timeoutClearError)
        clearTimeout(this.timeoutClearError)

      try {
        let {
          status = 0,
          body: {
            user = {},
            jwt = null,
            error = null
          }
        } = await this.$agent.post('/api/login')
            .send({
              user: this.loginUsername,
              password: this.loginPassword
            })
            .ok( ({status}) => status === 200 || status === 403 )
        if (status === 200) {
          this.$store.commit('login', {user, token: jwt})
          this.loginPopoverVisible = false
        }
        if (status === 403) {
          this.loginError = '用户名或密码不正确'
        }
        this.timeoutClearError = setTimeout( () => this.loginError = null, 3000 )
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '错误',
          message: '服务器故障：'+e.message
        })
        console.log(e)
      }
      this.busy = false
    },
    logout() {
      this.$store.commit('logout')
      this.loginPassword = null
      this.menuPopoverVisible = false
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
@import "../styles/form";
@import "../styles/flex-horz";
@import "../styles/flex-vert";

.popover-login
  .field
    .field-name
      width: 30px
  .controls
    display: flex
    flex-direction: row
    align-items: center
    justify-content: flex-end
    margin-top: 1em
    margin-bottom: .5em
  .alert-wrap
    justify-content: flex-end
    .login-alert
      width: auto

.login-ctrl
  .state
    .nickname
      margin-left: 1ch
      margin-right: 1ch

.el-button.golden
  background-color: #FFC107
  &:hover
    background-color: #FFCA28
  &:active
    background-color: #FFB300
</style>
