<template>
  <el-card class="question-list-item">
    <div class="flex-wrap flex-horz">
      <div class="title-wrap">
        <div class="flex-horz title-line">
          <router-link :to="'/question/'+question.qid">
            <h4 class="title">{{question.title}}</h4>
          </router-link>
          <el-tag
            type="warning"
            v-if="question.bounty > 0"
          > 悬赏：{{ question.bounty }} </el-tag>
        </div>
        <tags-display :tags="question.tags" @select="gotoTag"/>
      </div>
      <div class="stats flex-vert">
        <div class="num-answers">回答数：{{ question.numAnswer }}</div>
        <time-ago :time="question.created"></time-ago>
      </div>
    </div>
  </el-card>
</template>

<script>
import TimeAgo from './TimeAgo'
import TagsDisplay from './TagsDisplay'
export default {
  components: { TimeAgo, TagsDisplay },
  props: ['question'],
  methods: {
    gotoTag(tag) {
      this.$router.push('/#'+tag)
    }
  }
}
</script>

<style lang="stylus">
@import "../styles/flex-horz";
@import "../styles/flex-vert";
.question-list-item
  width: 100%
  margin: 1em 0
  a, a:visited, a:hover, a:active
    color: inherit
    text-decoration: none
  .title-wrap
    flex-grow: 1
  .title-line
    margin-bottom: 1em
  .title
    margin: 0
    margin-right: 2ch
    font-size: 18px
  .stats
    font-size: 13px
    color: #475669
    justify-content: center
    align-items: center
    .num-answers
      margin-bottom: .5em
</style>
