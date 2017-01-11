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
      <question-display :question="question" class="question-display">
        <!-- if is self question, insert 关闭问题，修改问题 controls -->
        <div slot="controls" class="controls" v-if="userOwnsQuestion && !question.closed">
          <el-button
            type="warning"
            icon="more"
            size="small"
            @click="editQuestion()"
          > 修改问题 </el-button>
          <el-button
            type="danger"
            icon="close"
            size="small"
            @click="closeQuestion()"
          > 关闭问题 </el-button>
        </div>

        <div slot="controls" class="controls"  v-if="!userOwnsQuestion && !question.closed">
          <el-tooltip
            effect="dark"
            :content="loggedOn ? '回答问题' : '请先登录'"
          >
            <el-button
              :type="btnAnswerEditorClicked ? 'info' : 'success'"
              :icon="btnAnswerEditorClicked ? 'minus': 'plus'"
              size="small"
              :disabled="!loggedOn"
              :loading="submittingAnswer"
              @click="toggleAnswerEditorBtn()"
            > {{ btnAnswerEditorClicked ? '取消回答' : '回答问题' }} </el-button>
          </el-tooltip>
        </div>
      </question-display>

      <transition>
        <el-card class="answer-editor-wrap" v-if="showAnswerEditor">
          <answer-editor
            v-model="newAnswer"
            :loading="submittingAnswer"
            ref="answerEditor"
          />
          <el-button
            type="success"
            size="small"
            icon="plus"
            @click="submitAnswer()"
          > 创建回答 </el-button>
        </div>
        </el-card>
      </transition>

      <transition-group class="answers" name="answer" tag="div">
        <answer-display
          :key="answer.aid"
          v-for="answer in fetchedAnswers"
          :answer="answer"
          :enable-select-best="!bestAnswerSelected && !question.closed"
          :show-select-best="userOwnsQuestion"
          @upvote="upvote(answer)"
          @downvote="downvote(answer)"
          @selectAsBest="selectAsBest(answer)"
        />
      </transition-group>
    </div>

  </div>
</template>

<script>
import {user, token, loggedOn} from './global-states'
import QuestionDisplay from './components/QuestionDisplay'
import AnswerDisplay from './components/AnswerDisplay'
import AnswerEditor from './components/AnswerEditor'
import scrollIntoView from 'scroll-into-view'

export default {
  components: { QuestionDisplay, AnswerDisplay, AnswerEditor },
  props: ['preload-question'],
  computed: {
    user,
    token,
    loggedOn,
    question() {
      return {
        content: '',
        user: { uid: null },
        ... this.preloadQuestion,
        ... (this.fetchedQuestion ? this.fetchedQuestion : {})
      }
    },
    qid() {
      return this.$route.params.qid
    },
    bestAnswerSelected() {
      return this.fetchedAnswers.filter( $ => $.best ).length > 0
    },
    userOwnsQuestion() {
      return this.user && this.user.uid === this.question.user.uid
    },
    showAnswerEditor() {
      return this.loggedOn && this.btnAnswerEditorClicked
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
      submittingAnswer: false,
      btnAnswerEditorClicked: false,
      newAnswer: {
        content: ''
      }
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
    },
    async rateAnswer(op) {
      try {
        let {
          status,
          body
        } = await op.ok( ({status}) => (200<=status && status<300)
                                    || (400<=status && status<500)
                  )
        if (status === 200 || status === 201) {
          if (body.wealth)
            this.$store.commit('updateWealth', body.wealth)
          return body
        }
        if (status === 409) {
          throw new Error(body.error || '您已评价过')
        }
      } catch(e) {
        this.$notify({
          type:  'warning',
          title: '评价失败',
          message: e.message
        })
        return null
      }
    },
    async upvote(answer) {
      let opUpvote = this.$agent.post(`/api/question/${this.qid}/answer/${answer.aid}/upvote`)
                     .send({ jwt: this.token })
      if ( await this.rateAnswer( opUpvote ) ) {
        answer.voted = 1
        answer.upvote++
      }
    },
    async downvote(answer) {
      let opDownvote = this.$agent.post(`/api/question/${this.qid}/answer/${answer.aid}/downvote`)
                       .send({ jwt: this.token })
      if ( await this.rateAnswer( opDownvote ) ) {
        answer.voted = -1
        answer.downvote++
      }
    },
    async selectAsBest(answer) {
      try {
        await this.$confirm(`确定要选择${answer.user.nickname}的回答为最佳答案吗？`, '选为最佳答案')
      }catch(e){
        return    // user cancelled
      }
      let opSelectAsBest = this.$agent.post(`/api/question/${this.qid}/answer/${answer.aid}/is-best`)
                           .send({ jwt: this.token, isBest: true })
      if ( await this.rateAnswer( opSelectAsBest ) ) {
        answer.best = true
        for (let i=0; i!==this.fetchedAnswers.length; ++i)
          if (this.fetchedAnswers[i] === answer)
            this.fetchedAnswers.unshift( ... this.fetchedAnswers.splice(i, 1) )
        this.fetchedQuestion.closed = true
        this.fetchedQuestion.solved = true
      }
    },
    async closeQuestion() {
      try {
        await this.$confirm('确定要关闭问题吗？', '关闭问题')
      }catch(e){
        return    // user cancelled
      }
      let opCloseQuestion = this.$agent.post(`/api/question/${this.qid}/close`)
                            .send({ jwt: this.token, close: true })
      if ( await this.rateAnswer( opCloseQuestion ) ) {
        this.fetchedQuestion.closed = true
        this.$notify({
          type: "success",
          title: "问题已关闭"
        })
      }
    },
    editQuestion() {
      this.$router.push(`/question/${this.qid}/edit`)
    },
    resetAnswer() {
      this.answer = {
        content: ''
      }
    },
    async submitAnswer() {
      let valid = await this.$refs.answerEditor.validate()
      if ( ! valid ) {
       return
      }
      this.submittingAnswer = true
      try {
        let {
          status,
          body: { answer, error }
        } = await this.$agent.post(`/api/question/${this.qid}/answer`)
                  .send({
                    answer: this.answer,
                    jwt: this.token
                  })
                  .ok( ({status}) => status === 200 || status === 201 || status === 400 )
        if (status === 200 || status === 201) {
          this.$notify({
            type: 'success',
            title: '成功创建回答',
          })
          this.resetAnswer()
          this.fetchedAnswers.unshift( answer )
          // TODO: add scroll behavior
        }
        if (status === 400) {
          this.$notify({
            type: 'warning',
            title: '创建回答失败',
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
      this.submittingAnswer = false
      this.btnAnswerEditorClicked = false
    },
    toggleAnswerEditorBtn() {
      this.btnAnswerEditorClicked = ! this.btnAnswerEditorClicked
      // TODO: add scroll to behavior
      // if (this.btnAnswerEditorClicked) {
      //   setTimeout( () => {
      //     scrollIntoView(this.$refs.answerEditor)
      //   }, 0)
      // }
    }
  },
  async mounted() {
    if ( await this.fetchQuestion(this.qid) )
      await this.fetchAnswers(this.qid)
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
  .controls
    margin-top: 3em
  .btn.reload
    display: block
    margin-top: 2em
    margin-left: auto
    margin-right: auto
  .answers
    margin-top: 2em
  .answer-move
    transition: transform 1s
  .question-display
    margin-bottom: 1em
</style>
