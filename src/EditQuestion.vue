<template>
  <div class="edit-question">
    <h2>修改问题</h2>
    <question-editor
      v-loading="loading"
      v-model="question"
      :loading="loading"
      :loading-text="loadingText"
      :title-readonly="true"
      :max-bounty="user ? Number(user.wealth) || 0 : 0"
      ref="editor"
    />

    <div class="controls">
      <el-button
        type="info"
        size="large"
        icon="d-arrow-left"
        @click="$router.go(-1)"
      > 返回 </el-button>
      <el-button
        type="success"
        size="large"
        :loading="loading"
        icon="edit"
        @click="submitQuestion()"
      > 修改问题 </el-button>
    </div>
  </div>
</template>

<script>
import QuestionEditor from './components/QuestionEditor'
import {user, token} from './global-states'

export default {
  components: { QuestionEditor },
  computed: {
    user,
    token,
    qid() { return this.$route.params.qid }
  },
  data() {
    return {
      loading: false,
      loadingText: '正在载入问题',
      question: {}
    }
  },
  async mounted() {
    await this.fetchQuestion()
  },
  methods: {
    async fetchQuestion() {
      this.loadingText = '正在载入问题'
      this.loading = true
      let {
        status,
        body: question
      } = await this.$agent.get(`/api/question/${this.qid}`)
      this.question = question
      this.loading = false
    },
    async submitQuestion() {
      let valid = await this.$refs.editor.validate()
      if ( ! valid ) {
        return
      }
      this.loadingText = '正在修改问题'
      this.loading = true
      try {
        let {
          status,
          body: { qid, error }
        } = await this.$agent.post(`/api/question/${this.qid}`)
                  .send({
                    question: this.question,
                    jwt: this.token
                  })
                  .ok( ({status}) => status === 200 || status === 201 || status === 400 )
        if (status === 200 || status === 201) {
          this.$notify({
            type: 'success',
            title: '问题修改成功',
            message: '即将跳转到问题页面',
            duration: 0,
          })
          setTimeout( () => this.$router.replace('/question/'+qid), 3000 )
          return
        }
        if (status === 400) {
          this.$notify({
            type: 'warning',
            title: '问题修改失败',
            message: error,
            duration: 0
          })
        }
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '服务器故障',
          message: e.message
        })
      }
      this.loading = false
    },
    resetForm() {
      this.$refs.editor.reset()
    }
  }
}
</script>

<style lang="stylus">
.edit-question
  margin: 0 auto
  max-width: 80ch
  h2
    text-align: center
</style>
