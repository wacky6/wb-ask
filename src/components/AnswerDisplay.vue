<template>
  <el-card class="answer" :best="isBest">
    <!-- <transition name="header-best-answer"> -->
      <h4 slot="header" class="title is-best" v-if="isBest">
        <i class="icon el-icon-circle-check" />最佳答案
      </h4>
    <!-- </transition> -->
    <div class="flex-horz">
      <answer-voter class="voter"
        :voted="answer.voted"
        :enable-select-best="enableSelectBest"
        :is-best="answer.best"
        :loading="loading"
        :upvote="answer.upvote"
        :downvote="answer.downvote"
        :show-select-best="showSelectBest"
        :disabled="!loggedOn"
        :disabled-tooltip="'请先登录'"
        @upvote="upvote()"
        @downvote="downvote()"
        @selectAsBest="selectAsBest()"
      />
      <div class="content-wrap flex-vert">
        <div class="content" v-html="marked(answer.content)" />
        <div class="publisher flex-horz">
          <user-display type="mini" class="user-display" :user="answer.user" />
          <time-ago :time="answer.created" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import marked from 'marked'
import UserDisplay from './UserDisplay'
import AnswerVoter from './AnswerVoter'
import TimeAgo from './TimeAgo'
import {loggedOn} from '../global-states'

export default {
  components: { UserDisplay, AnswerVoter, TimeAgo },
  props: ['answer', 'enable-select-best', 'show-select-best'],
  data: () => ({
    loading: false
  }),
  computed: {
    loggedOn,
    isBest() { return this.answer.best }
  },
  methods: {
    marked,
    upvote() { this.$emit('upvote') },
    downvote() { this.$emit('downvote') },
    selectAsBest() { this.$emit('selectAsBest') }
  }
}
</script>

<style lang="stylus">
@import "../styles/flex-horz.styl";
@import "../styles/flex-vert.styl";
.answer
  margin: 0
  border-collapse: collapse
  .voter
    margin-right: 3ch
  .flex-horz
    align-items: flex-start
  .header-best-answer-enter
    height: 0
  .header-best-answer-enter-to
    height: auto
  .header-best-answer-enter-active
    transition: .5s all
  &[best]
    border-color: #13CE66
    box-shadow: 0 2px 4px 0 rgba(19,206,102,.24), 0 0 6px 0 rgba(19,206,102,.08)
    .el-card__header
      background-color: rgba(19,206,102,0.23)
    .title
      margin: 0
      padding: 0
      color: #08542a
      .icon
        margin-right: 1.5ch
        color: #0fa552
  .content-wrap
    align-self: stretch
    flex-grow: 1
    justify-content: space-between
    .publisher
      opacity: 0.6
      font-size: 13px
      align-self: flex-end
      align-items: center
      .user-display
        margin-right: 2ch
</style>
