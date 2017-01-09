<template>
  <div>
    <transition-group class="question-list" name="question-list" tag="div">
      <question-list-item
        v-for="$ in questions"
        :question="$"
        :key="$.qid"
      />
    </transition-group>
    <div class="controls">
      <el-button
        type="success"
        :disabled="!hasMoreData"
        :loading="loading"
        :icon="hasMoreData ? 'more' : 'warning'"
        @click="fetchNextPage()"
      > {{ hasMoreData ? '载入更多' : '没有更多内容' }} </el-button>
      <el-button
        type="info"
        :loading="loading"
        icon="time"
        @click="reload()"
      > 重新载入 </el-button>
    </div>
  </div>
</template>

<script>
import QuestionListItem from './QuestionListItem'
import {user, token, loggedOn} from '../global-states'
export default {
  props: ['query'],
  components: { QuestionListItem },
  computed: {
    user,
    token,
    loggedOn
  },
  data: () => ({
    loading: false,
    questions: [],
    hasMoreData: true,
    curPage: 0
  }),
  methods: {
    async fetchNextPage(query) {
      try {
        this.loading = true
        let {
          status,
          body
        } = await this.$agent.get('/api/question')
                  .query({ ...this.query })
                  .query({ page: ++this.curPage })
                  .query({ jwt:  this.token })
        this.loading = false
        if (status===200) {
          return this.questions.push( ... body.list )
        }
        if (status===204 || (body.list && body.list.length === 0) ) {
          return this.hasMoreData = false
        }
      } catch(e) {
        this.$notify({
          type: 'warning',
          title: '获取问题失败',
          message: e.message
        })
      }
    },
    reload() {
      this.curPage = 0
      this.questions = []
      this.hasMoreData = true
      this.fetchNextPage()
    }
  },
  async mounted() {
    this.fetchNextPage()
  },
  watch: {
    query() {
      this.reload()
    }
  }
}
</script>

<style lang="stylus">
.question-list
  padding: 0
  max-width: 70ch
  .question-list-move
    transition: transform 1s
</style>
