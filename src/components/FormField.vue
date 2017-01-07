<template>
  <label class="field">
    <span class="field-name">{{name}}</span>
    <slot></slot>
  </label>
</template>

<script>
export default {
  props: ['name']
}
</script>

<style lang="stylus">
.field
  .field-name
    text-align: right
</style>
