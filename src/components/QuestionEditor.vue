<template>
  <el-form
    :model="question"
    :rules="rules"
    label-position="top"
    ref="form"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <el-form-item label="问题名称" prop="title">
      <el-input
        v-model="question.title"
        autofocus
        placeholder="简短描述题目"
        :disabled="titleReadonly"
      />
    </el-form-item>
    <el-form-item label="问题描述" prop="content">
      <markdown-editor
        v-model="question.content"
        placeholder="请输入问题正文。支持Markdown语法。"
        :autofocus="autofocusEditor"
      />
    </el-form-item>
    <el-form-item label="问题标签" prop="tags">
      <el-select
        v-model="question.tags"
        multiple
        filterable
        allow-create
        placeholder="选择或输入问题标签"
      >
        <el-option
          v-for="tag in tagList"
          :label="tag"
          :value="tag"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="悬赏" prop="bounty">
      <el-input-number
        v-model="question.bounty"
        :min="0"
        :max="maxBounty"
        :step="5"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import MarkdownEditor from './MarkdownEditor'

function emitQuestionValue() { this.$emit('input', this.question) }

export default {
  components: { MarkdownEditor },
  props: ['loading', 'loading-text', 'value', 'max-bounty', 'title-readonly'],
  data: () => ({
    question: {
      title: '',
      content: '',
      tags: [],
      bounty: 0,
    },
    rules: {
      title: [
        { required: true, message: '请输入问题标题', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请详细描述问题', trigger: 'blur' }
      ]
    },
    tagList: []
  }),
  computed: {
    autofocusEditor() {
      return false
    }
  },
  methods: {
    validate() {
      return new Promise( (resolve) => this.$refs.form.validate( resolve ) )
    },
    reset() {
      this.question.title = ''
      this.question.content = ''
      this.question.tags = []
      this.question.bounty = 0
    }
  },
  watch: {
    'question.title':   emitQuestionValue,
    'question.content': emitQuestionValue,
    'question.tags':    emitQuestionValue,
    'question.bounty':  emitQuestionValue,
    value() {
      setTimeout( () => {
        if (!this.value) {
          this.reset()
        }else{
          this.question.title = this.value.title
          this.question.content = this.value.content
          this.question.tags = this.value.tags
          this.question.bounty = this.value.bounty
        }
      }, 0)
    }
  }
}
</script>

<style lang="stylus">
</style>
