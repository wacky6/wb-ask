<template>
  <el-card class="question">

    <div slot="header" class="flex-horz">
      <div class="brief">
        <div class="title flex-horz">
          <h2>{{ question.title }}</h2>
          <el-tag
            type="warning"
            v-if="question.bounty > 0"
            class="bounty"
          > 悬赏：<strong>{{ question.bounty }}</strong> </el-tag>
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
      .bounty
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
