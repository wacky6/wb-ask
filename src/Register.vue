<template>
  <div class="register">
    <h2>注册</h2>
    <form>

      <form-field name="邮箱">
        <el-input
          class="field-input"
          v-model="email"
          type="text"
          placeholder="邮箱"
          :disabled="disabled"
        />
      </form-field>

      <form-field name="密码">
        <el-input
          class="field-input"
          v-model="password"
          type="password"
          placeholder="密码"
          :disabled="disabled"
        />
      </form-field>

      <form-field name="昵称">
        <el-input
          class="field-input"
          v-model="nickname"
          type="text"
          placeholder="昵称"
          autofocus
          :disabled="disabled"
        />
      </form-field>

      <form-field name="真实姓名">
        <el-input
          class="field-input"
          v-model="name"
          type="text"
          placeholder="张三"
          :disabled="disabled"
        />
      </form-field>

      <form-field name="性别">
        <el-radio-group class="field-input radio flex-lr" v-model="gender">
          <el-radio label="M" :disabled="disabled">男</el-radio>
          <el-radio label="F" :disabled="disabled">女</el-radio>
        </el-radio-group>
      </form-field>

      <form-field name="生日">
        <el-date-picker
          class="field-input"
          v-model="birthday"
          type="date"
          placeholder="请选择出生日期"
          :disabled="disabled"
        />
      </form-field>
    </form>

    <div class="controls">
      <!--
        show loading animation if registration is successful,
        UI will redirect to Index in a few seconds
      -->
      <el-button
        class="btn register"
        type="success"
        size="large"
        :loading="busy || registerSuccess"
        :disabled="!formFilled"
        @click="register()"
      > 注册 </el-button>
    </div>

    <div class="flex-lr alert-wrap">
      <el-alert
        class="alert"
        v-if="Boolean(registerError)"
        type="warning"
        title="注册失败"
        :description="registerError"
        :closable="false"
        show-icon
      />
      <el-alert
        class="alert"
        v-if="registerSuccess"
        type="success"
        title="注册成功，即将跳转到主页"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script>
import FormField from './components/FormField.vue'
import {user, loggedOn} from './global-states.js'
import EmailValidator from 'email-validator'
export default {
  components: { FormField },
  data: () => ({
    nickname: null,
    email: null,
    password: null,
    passwordVerify: null,
    name: null,
    gender: null,
    birthday: null,
    busy: false,
    registerError: null,
    registerSuccess: false,
  }),
  computed: {
    user, loggedOn,
    disabled() { return this.busy || this.registerSuccess },
    formFilled() {
      return this.nickname
          && EmailValidator.validate(this.email)
          && this.password
          && this.name
          && this.gender === 'M' || this.gender === 'F'
          && this.birthday
    }
  },
  watch: {
    loggedOn(val) {
      if (val === true)
        this.$router.replace('/')
    }
  },
  methods: {
    async register() {
      this.busy = true
      let payload = {
        nickname: this.nickname,
        email:    this.email,
        password: this.password,
        name:     this.name,
        gender:   this.gender,
        birthday: String(this.birthday).split('T')[0],
      }
      let {
        status = 0,
        body
      } = await this.$agent.post('/api/user')
                .send(payload)
                .ok( ({status}) => status !== 500 )

      this.busy = false
      if (status === 201 || status === 200) {
        this.registerSuccess = true
        setTimeout( () => this.$router.replace('/'), 3000 )
        return
      } else {
        this.registerError = body.error || '服务器故障'
        return
      }
    },
    clearFields() {
      this.nickname = null
      this.email = null
      this.password = null
      this.passwordVerify = null
      this.name = null
      this.gender = null
      this.birthday = null
    }
  }
}
</script>

<style lang="styl">
@import "./styles/flex-lr.styl";
.register
  h2
    text-align: center
  .field
    .field-name
      width: 80px
  .field-input
    width: 180px
    &.radio
      height: 36px

  .controls
    margin-top: 2em
    margin-bottom: .5em
    text-align: center
    .btn.register
      min-width: 240px

  .alert-wrap
    justify-content: center
    .alert
      max-width: 240px
</style>
