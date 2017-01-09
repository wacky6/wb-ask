<template>
  <el-form
    :model="answer"
    :rules="rules"
    label-position="top"
    ref="form"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <el-form-item label="问题回答" prop="content">
      <markdown-editor
        v-model="answer.content"
        placeholder="请输入回答。支持Markdown语法。"
        :autofocus="true"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import MarkdownEditor from './MarkdownEditor'

function emitAnswerValue() { this.$emit('input', this.answer) }

export default {
  components: { MarkdownEditor },
  props: ['value', 'loading'],
  data: () => ({
    loadingText: '正在创建回答',
    answer: {
      content: ''
    },
    rules: {
      content: [
        { required: true, message: '请回答问题', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    validate() {
      return new Promise( (resolve) => this.$refs.form.validate( resolve ) )
    }
  },
  watch: {
    'answer.content': emitAnswerValue,
    value() {
      setTimeout( () => {
        if (!this.value) {
          this.answer.content = ''
        } else {
          this.answer.content = this.value.content
        }
      }, 0)
    }
  }
}
</script>

<style lang="stylus">
</style>
