<template>
  <div class="login-ctrl">
    <el-popover
      ref="popover-login"
      v-model="loginPopoverVisible"
    >
      <form class="popover-login-form">
        <label class="field">
          <span class="field-name">用户名</span>
          <el-input
            class="field-input"
            v-model="loginUsername"
            type="text"
            placeholder="昵称 或 邮件地址"
            icon="information"
            autofocus
            :disabled="busy || loggedOn"
          ></el-input>
        </label>
        <label class="field">
          <span class="field-name">密码</span>
          <el-input
            class="field-input"
            v-model="loginPassword"
            type="text"
            placeholder="密码"
            icon="information"
            :disabled="busy || loggedOn"
          ></el-input>
        </label>

        <el-popover
          ref="popover-login-alert"
          trigger="manual"
          v-model="loginErrorPopoverVisible"
        >
          <el-alert
            title="用户名或密码不正确"
            type="warning"
            :closable="false"
          >
          </el-alert>
        </el-popover>

        <div class="controls">
          <el-button
            class="btn login"
            type="success"
            icon="check"
            :loading="busy"
            :disabled="loggedOn"
            v-popover:popover-login-alert
            trigger="click"
            placement="down"
            @click="login()"
          >
            登录
          </el-button>
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
        >
          退出
        </el-button>
      </div>
      <el-button
        v-show="!loggedOn"
        v-popover:popover-login
        placement="down"
        icon="information"
        type="primary"
      >
        登录
      </el-button>
    </div>
  </div>
</template>

<script>
import {Input, Button, Popover} from 'element-ui'

export default {
  name: 'login-ctrl',
  data: ()=>({
    loginUsername: '',
    loginPassword: '',
    loginPopoverVisible: false,
    loginError: null,
    busy: false
  }),
  computed: {
    loggedOn() { return Boolean(this.user) },
    user() { return this.$store.state.user },
    loginErrorPopoverVisible() { return Boolean(this.loginError) }
  },
  methods: {
    async login() {
      this.busy = true
      this.loginError = null

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

      this.busy = false
    },
    logout() {
      this.$store.commit('logout')
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

.login-ctrl
  .state
    .nickname
      margin-left: 1ch
      margin-right: 1ch
</style>
