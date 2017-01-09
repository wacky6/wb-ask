<template>
  <div class="register">
    <h2>注册</h2>

    <el-form
      class="form"
      :model="reg"
      :rules="rules"
      label-position="right"
      label-width="96px"
      ref="form"
      v-loading="loading"
      element-loading-text="正在注册"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="reg.email"
          autofocus
          type="text"
          placeholder="请输入常用邮箱"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="reg.password"
          type="password"
          placeholder="密码"
        />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="reg.nickname"
          type="text"
          placeholder="昵称"
        />
      </el-form-item>

      <el-form-item label="真实姓名" prop="name">
        <el-input
          v-model="reg.name"
          type="text"
          placeholder="张三"
        />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group class="radio flex-horz" v-model="reg.gender">
          <el-radio label="M">男</el-radio>
          <el-radio label="F">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="性别" prop="birthday">
        <el-date-picker
          v-model="reg.birthday"
          type="date"
          :picker-options="datePickerOptions"
          placeholder="请选择出生日期"
        />
      </el-form-item>

    <div class="controls">
      <!--
        show loading animation if registration is successful,
        UI will redirect to Index in a few seconds
      -->
      <el-button
        class="btn register"
        type="success"
        size="large"
        :loading="loading"
        @click="register()"
      > 注册 </el-button>
    </div>
  </div>
</template>

<script>
import FormField from './components/FormField.vue'
import {user, loggedOn} from './global-states.js'
import EmailValidator from 'email-validator'
export default {
  components: { FormField },
  data() {
    let validateEmail = (r, v, cbk) => {
      if (EmailValidator.validate(v))
        cbk()
      else
        cbk(new Error('邮箱格式不正确'))
    }
    let validateBirthday = (r, v, cbk) => {
      if (v instanceof Date)
        cbk()
      else
        cbk(new Error('请选择出生日期'))
    }
    let rules = {
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: validateEmail, trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请详细描述问题', trigger: 'blur' }
      ],
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入真实姓名', trigger: 'blur' }
      ],
      gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ],
      birthday: [
        { validator: validateBirthday, trigger: 'change' }
      ]
    }
    return {
      reg: {
        email: null,
        password: null,
        nickname: null,
        name: null,
        gender: null,
        birthday: null
      },
      rules,
      loading: false,
      datePickerOptions: {
        disabledDate: (v) => v.valueOf() >= new Date().valueOf()
      }
    }
  },
  computed: {
    user, loggedOn,
  },
  watch: {
    loggedOn(val) {
      if (val === true)
        this.$router.replace('/')
    }
  },
  methods: {
    validate() {
      return new Promise( (resolve) => this.$refs.form.validate( resolve ) )
    },
    async register() {
      if ( ! await this.validate() )
        return
      this.loading = true
      let payload = {
        nickname: this.reg.nickname,
        email:    this.reg.email,
        password: this.reg.password,
        name:     this.reg.name,
        gender:   this.reg.gender,
        birthday: this.reg.birthday.toISOString().split('T')[0],
      }
      try{
        let {
          status = 0,
          body
        } = await this.$agent.post('/api/user')
                  .send(payload)
                  .ok( ({status}) => status !== 500 )
        if (status === 201 || status === 200) {
          this.$notify({
            type: 'success',
            title: '注册成功',
            message: '3秒后跳转到主页',
            duration: 3000,
            onClose: () => this.$router.replace('/')
          })
          return
        } else {
          this.$notify({
            type: 'warning',
            title: '注册失败',
            message: body.error,
            duration: 0
          })
        }
      } catch(e) {
        this.$notify({
          type: 'danger',
          title: '服务器故障',
          message: '请稍后再试',
          duration: 0
        })
      }
      this.loading = false
    },
    reset() {
      this.reg = {
        email: null,
        password: null,
        nickname: null,
        name: null,
        gender: null,
        birthday: null
      }
    }
  }
}
</script>

<style lang="styl">
@import "./styles/flex-horz.styl";
.register
  h2
    text-align: center

  .form
    max-width: 33ch
    margin: 0 auto
    .radio
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
