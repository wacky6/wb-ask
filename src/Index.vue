<template>
  <div class="index flex-horz">
    <question-finder />
    <top-ranking-list />
  </div>
</template>

<script>
import TopRankingList from './components/TopRankingList'
import QuestionFinder from './components/QuestionFinder'

export default {
  components: { TopRankingList, QuestionFinder },
}
</script>

<style lang="stylus">
@import "styles/flex-horz";
.index.flex-horz
  max-width: 100ch
  margin: 0 auto
  align-items: flex-start
  justify-content: space-between
  .question-list-tabs
    min-width: 60ch
    margin-right: 8ch
</style>
