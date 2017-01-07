<template>
  <div
    v-loading="loading"
    element-loading-text="正在载入"
    class="view-question"
  >
    <template v-if="error">
      <el-button
        size="large"
        type="success"
        @click="fetchQuestion()"
        class="btn reload"
        icon="more"
      > 重新加载 </el-button>
    </template>

    <div v-if="!error">
      <question-display :question="question">
        <!-- if is self question, insert 关闭问题，修改问题 controls -->
      </question-display>

      <div class="answers">
        <answer-display
          v-for="answer in fetchedAnswers"
          :answer="answer"
          :showSelectBestAnswer="!bestAnswerSelected"
          @upvote="upvote(answer)"
          @downvote="downvote(answer)"
          @bestAnswer="selectBest(answer)"
        />
      </div>
    </div>

  </div>
</template>

<script>
import {user, token} from './global-states'
import QuestionDisplay from './components/QuestionDisplay'
import AnswerDisplay from './components/AnswerDisplay'

export default {
  components: { QuestionDisplay, AnswerDisplay },
  props: ['preload-question'],
  computed: {
    user,
    token,
    question() {
      return {
        content: '',
        ... this.preloadQuestion,
        ... (this.fetchedQuestion ? this.fetchedQuestion : {})
      }
    },
    bestAnswerSelected() {
      return this.fetchedAnswers.filter( $ => $.best ).length > 0
    }
  },
  data() {
    return {
      error: null,
      loading: false,
      loadingText: '正在载入',
      fetchedQuestion: null,
      fetchedAnswers: [],
      curAnswerPage: 1,
    }
  },
  methods: {
    async fetchQuestion(qid) {
      this.loading = true
      this.error = null
      try {
        let {
          status,
          body: question
        } = await this.$agent.get('/api/question/'+qid)
                  .ok( ({status}) => status === 200 || status === 404 )
        if (status === 404) {
          let timeout = setTimeout( () => this.$router.go(-1), 5000 )
          this.error = new Error('Not Found')
          this.$alert('这个问题不存在，5秒后返回上一个页面', '问题不存在',{
            confirmButtonText: '确定',
            callback: () => {
              clearTimeout(timeout)
              this.$router.go(-1)
            }
          })
        }
        if (status === 200)
          this.fetchedQuestion = question
      } catch(e) {
        this.error = e
        this.$notify({
          type: 'error',
          title: '问题载入详情失败',
          message: e.message
        })
      }
      this.loading = false
      return !this.error
    },
    async fetchAnswers(qid) {
      this.loading = true
      try {
        let {
          status,
          body: { list: answers }
        } = await this.$agent.get('/api/question/'+qid+'/answers')
        if (status === 200) {
          this.fetchedAnswers = answers
          this.curAnswerPage = 1
        }
      } catch(e) {
        this.error = e
        this.$notify({
          type: 'error',
          title: '回答载入失败',
          message: e.message
        })
      }
      this.loading = false
      return !this.error
    }
  },
  async mounted() {
    let qid = this.$route.params.qid
    if ( await this.fetchQuestion(qid) )
      await this.fetchAnswers(qid)
  }
}
</script>

<style lang="stylus">
@import "./styles/flex-horz";
.view-question
  width: 100%
  flex-grow: 1
  margin: 0 auto
  max-width: 80ch
  .btn.reload
    display: block
    margin-top: 2em
    margin-left: auto
    margin-right: auto
  .answers
    margin-top: 2em
</style>
