<template>
  <div class="question-finder">
    <h4>问题列表</h4>
    <el-menu
      ref="menu"
      :default-active="activeType"
      lass="menu"
      mode="horizontal"
      @select="selectType"
    >
      <el-menu-item index="all">全部</el-menu-item>
      <el-menu-item index="solved">已解决</el-menu-item>
      <el-menu-item index="unsolved">未解决</el-menu-item>
      <el-menu-item index="bounty">高悬赏</el-menu-item>
      <el-menu-item @click.native="showSelectTag()" index="tag">问题分类</el-menu-item>
      <el-menu-item index="my" v-if="loggedOn">我提问的</el-menu-item>
      <el-menu-item index="my-answer" v-if="loggedOn">我回答的</el-menu-item>
    </el-menu>
    <tag-select-dialog ref="tagSelectDialog" @close="selectTag" />
    <question-list :query="questionListQuery" />
  </div>
</template>

<script>
import QuestionList from './QuestionList'
import TagSelectDialog from './TagSelectDialog'
import {user, token, loggedOn} from '../global-states'

export default {
  components: { QuestionList, TagSelectDialog },
  computed: {
    loggedOn,
    questionListQuery() {
      let type = this.activeType
      let tag = type === 'tag' ? this.$route.hash.slice(1) : ''
      let order = type === 'bounty' ? 'bounty' : 'latest'
      return { type, tag, order }
    },
    activeType() {
      let keys = ['all', 'solved', 'unsolved', 'bounty', 'my', 'my-answer']
      for (let key of keys)
        if (key in this.$route.query)
          return key
      if (this.$route.hash.length > 1)
        return 'tag'
      return 'all'
    },
  },
  data: () => ({
    isSelectingTag: false
  }),
  methods: {
    showSelectTag() {
      this.$refs.tagSelectDialog.open()
    },
    selectType(type) {
      if (type!=='tag')    // type === 'tag is handled in @click.native -> showSelectTag
        this.$router.push('/?'+type)
    },
    selectTag(tag) {
      if (tag) {
        this.$router.push('/#'+tag)
      } else {
        // user may cancel tag selection, restore to previous selected type
        this.$refs.menu.activeIndex = this.activeType
      }
    }
  },
}
</script>
