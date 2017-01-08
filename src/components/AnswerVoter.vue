<template>
  <div v-loading="loading" class="answer-voter flex-vert">
    <div class="vertical-button-group flex-vert">
      <el-tooltip class="item" effect="dark" :content="voteupTooltip" placement="top">
        <el-button
          type="text"
          :plain="true"
          icon="arrow-up"
          class="upvote"
          :disabled="voted !== 0 || disabled"
          :voted="voted === 1"
          @click="$emit('upvote')"
        />
      </el-tooltip>

      <div class="score"> {{ upvote - downvote }} </div>

      <el-tooltip class="item" effect="dark" :content="votedownTooltip" placement="top">
        <el-button
          type="text"
          :plain="true"
          icon="arrow-down"
          class="downvote"
          :disabled="voted !== 0 || disabled"
          :voted="voted === -1"
          @click="$emit('downvote')"
        />
      </el-tooltip>

      <el-tooltip effect="dark" :content="selectBestTooltip"  placement="top" v-if="showSelectBest">
        <el-button
          :type="isBest ? 'info' : 'success'"
          icon="check"
          class="btn select-as-best"
          :disabled="isBest || enableSelectBest===false"
          :is-best="isBest"
          @click="$emit('selectAsBest')"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import {user} from '../global-states'
export default {
  props: [
    'upvote',
    'downvote',
    'voted',
    'loading',
    'disabled',
    'disabled-tooltip',
    'is-best',
    'enable-select-best',
    'show-select-best'
  ],
  computed: {
    user,
    selectBestTooltip() {
      if (!this.isBest && this.enableSelectBest)
        return '选为最佳答案'
      if (this.isBest)
        return '已选为最佳答案'
      return '已选择最佳答案'
    },
    voteupTooltip() {
      if (this.voted)
        return '已点赞'
      if (this.disabled)
        return this.disabledTooltip || '您没有点赞权限'
      return '点赞'
    },
    votedownTooltip() {
      if (this.voted)
        return '已差评'
      if (this.disabled)
        return this.disabledTooltip || '您没有差评权限'
      return '差评'
    },
  }
}
</script>

<style lang="stylus">
.answer-voter
  .vertical-button-group
    align-items: center
    .el-button
      border-width: 0
      margin-left: 0
      &.upvote[voted]
        color: #13CE66
      &.downvote[voted]
        color: #FF4949
    .score
      margin: .5em
    .btn.select-as-best
      margin-top: 1em
      &[is-best]
        background-color: #42d885
        border-color: #42d885
        color: #fff
</style>
