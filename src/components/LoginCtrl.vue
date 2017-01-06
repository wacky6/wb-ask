<template>
  <div class="login-ctrl">
    <el-popover
      ref="popover-login"
      v-model="loginPopoverVisible"
      popper-class="popover-login-form"
    >
      <form>
        <form-field name="用户名">
          <el-input
            class="field-input"
            v-model="loginUsername"
            type="text"
            placeholder="用户名 或 邮件地址"
            icon="information"
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
            icon="information"
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
        <div class="alert-wrap flex-lr" v-if="loginError">
          <el-alert class="login-alert" type="warning" title="用户名或密码不正确" :closable="false"/>
        </div>
      </form>
    </el-popover>

    <div class="state">
      <div v-show="loggedOn" class="flex-lr">
        <span class="nickname">{{user ? user.nickname : ''}}</span>
        <el-button
          type="danger"
          size="mini"
          v-if="loggedOn"
          icon="close"
          @click="logout()"
        > 退出 </el-button>
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

      let {
        status = 0,
        body: {
          user = {},
          token = null,
          error = null
        }
      } = await this.$agent.post('/api/login')
          .send({
            user: this.loginUsername,
            password: this.loginPassword
          })
          .ok( ({status}) => status === 200 || status === 403 )

      if (status === 200) {
        this.$store.commit('login', user, token)
        this.loginPopoverVisible = false
      }

      if (status === 403) {
        this.loginError = '用户名或密码不正确'
      }

      this.timeoutClearError = setTimeout( () => this.loginError = null, 3000 )

      this.busy = false
    },
    logout() {
      this.$store.commit('logout')
      this.loginPassword = null
    }
  }
}
</script>

<style lang="stylus">
@import "../styles/form";
@import "../styles/flex-lr";

.popover-login-form
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
</style>
