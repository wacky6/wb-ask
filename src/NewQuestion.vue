<template>
  <div class="new-question">
    <h2>提问</h2>
    <question-editor
      v-model="question"
      :loading="loading"
      :loading-text="loadingText"
      :max-bounty="user ? Number(user).wealth || 0 : 0"
      ref="editor"
    />

    <div class="controls">
      <el-button
        type="success"
        size="large"
        :loading="loading"
        icon="plus"
        @click="submitQuestion()"
      > 创建问题 </el-button>
    </div>
  </div>
</template>

<script>
import QuestionEditor from './components/QuestionEditor'
import {user, token} from './global-states'

export default {
  components: { QuestionEditor },
  computed: { user, token },
  data() {
    return {
      loading: false,
      loadingText: '正在创建问题',
      question: {}
    }
  },
  methods: {
    async submitQuestion() {
      let valid = await this.$refs.editor.validate()
      if ( ! valid ) {
        return
      }
      this.loading = true
      try {
        let {
          status,
          body: { qid, error }
        } = await this.$agent.post('/api/question')
                  .send({
                    question: this.question,
                    jwt: this.token
                  })
                  .ok( ({status}) => status === 200 || status === 201 || status === 400 )
        if (status === 200 || status === 201) {
          this.$notify({
            type: 'success',
            title: '问题创建成功',
            message: '即将跳转到问题页面',
            duration: 0,
          })
          this.resetForm()
          this.setTimeout( () => this.$router.replace('/question/'+qid), 3000 )
          return
        }
        if (status === 400) {
          this.$notify({
            type: 'warning',
            title: '问题创建失败',
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
      this.$refs.editor.resetFields()
    }
  }
}
</script>

<style lang="stylus">
.new-question
  margin: 0 auto
  max-width: 80ch
  h2
    text-align: center
</style>
