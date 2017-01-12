<template>
  <div class="markdown-editor">
    <textarea ref="editor-textarea"></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'

export default {
  props: ['value', 'disabled', 'placeholder', 'autofocus'],
  data: () => ({}),
  mounted() {
    this.editor = new SimpleMDE({
      element: this.$refs.editorTextarea,
      shortcuts: [],
      placeholder: this.placeholder,
      status: false,
      spellChecker: false,
      autofocus: this.autofocus
    })
    this.editor.codemirror.on('inputRead', () => {
      this.$emit('input', this.editor.value())
    })
  },
  watch: {
    value(val, old) {
      // update value asynchronously
      // synchronous update cause absurd input cursor behavior
      this.$nextTick( () => {
        if (this.editor.value() !== val)
          this.editor.value(val || '')
      })
    }
  }
}
</script>
