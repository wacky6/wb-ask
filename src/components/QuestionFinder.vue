<template>
  <div class="question-finder">
    <div class="title flex-horz">
      <h4>问题列表</h4>
      <el-tooltip
        effect="dark"
        placement="top"
        :content="loggedOn ? '发布问题' : '请先登录'"
      >
        <el-button
          :disabled="!loggedOn"
          size="small"
          type="primary"
          icon="plus"
          @click="$router.push('/question/new')"
        > 提问 </el-button>
      </el-tooltip>
    </div>
    <el-menu
      ref="menu"
      :default-active="menuActiveItem"
      class="menu"
      mode="horizontal"
      @select="selectType"
    >
      <el-submenu index="group1">
        <template slot="title">{{ titleGroup1 }}</template>
        <el-menu-item index="all">全部</el-menu-item>
        <el-menu-item index="solved">已解决</el-menu-item>
        <el-menu-item index="unsolved">未解决</el-menu-item>
        <el-menu-item index="bounty">高悬赏</el-menu-item>
      </el-submenu>
      <el-submenu index="group2" v-if="loggedOn">
        <template slot="title">{{ titleGroup2 }}</template>
        <el-menu-item index="my">我提问的</el-menu-item>
        <el-menu-item index="my-answer">我回答的</el-menu-item>
      </el-submenu>
      <el-menu-item @click.native.prevent="showSelectTag()" index="tag">问题分类</el-menu-item>
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
      if (type.startsWith('my') && !this.loggedOn)
        return null
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
    titleGroup1() {
      return ({
        'all': '全部',
        'solved': '已解决',
        'unsolved': '未解决',
        'bounty': '悬赏'
      })[ this.activeType ] || '全部'
    },
    titleGroup2() {
      return ({
        'my': '我提出的',
        'my-answer': '我回答的'
      })[ this.activeType ] || '和我有关'
    }
  },
  data: () => ({
    isSelectingTag: false,
    menuActiveItem: '',
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
        // user may cancel tag selection
        this.$refs.menu.activeIndex = this.activeType
      }
    }
  },
  created() {
    if (!this.questionListQuery)
      this.$router.replace('/')
  }
}
</script>

<style lang="stylus">
@import "../styles/flex-horz";
.question-finder
  .title
    h4
      flex-grow: 1
</style>
