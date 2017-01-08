<template>
  <el-card class="question">

    <div slot="header" class="flex-horz">
      <div class="brief">
        <div class="title flex-horz">
          <h2>{{ question.title }}</h2>
          <div class="hints">
            <el-tag
              type="warning"
              v-if="question.bounty > 0"
            > 悬赏：{{ question.bounty }} </el-tag>
            <el-tag
              type="danger"
              v-if="question.closed && !question.solved"
            > 已关闭 </el-tag>
            <el-tag
              type="success"
              v-if="question.solved"
            > 已解决 </el-tag>
          </div>
        </div>
        <div class="num-of-visits"> 浏览次数：{{ question.numVisit }}</div>
        <tags-display :tags="question.tags" :click="gotoTag" />
      </div>
      <div class="publisher">
        <user-display :user="question.user" />
        <time-ago :time="question.created" />
      </div>
    </div>

    <div v-html="marked(question.content||'')" />

    <slot name="controls"></slot>

  </el-card>
</template>

<script>
import marked from 'marked'
import UserDisplay from './UserDisplay'
import TimeAgo from './TimeAgo'
import TagsDisplay from './TagsDisplay'

export default {
  components: { UserDisplay, TimeAgo, TagsDisplay },
  props: ['question', 'user'],
  computed: {
    questionClosed() {
      return this.question && this.question.closed
    }
  },
  data() {
    return {
      gotoTag: (tag) => { this.$router.push('/tag/'+tag) }
    }
  },
  methods: { marked }
}
</script>

<style lang="stylus">
.question
  .brief
    flex-grow: 1
    .title
      align-items: center
      .hints
        margin-left: 4ch
      h2
        margin: 0
    .num-of-visits
      font-size: 12px
      color: #475669
      margin: .5em 0
  .publisher
    font-size: 14px
</style>
