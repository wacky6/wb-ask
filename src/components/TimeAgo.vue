<template>
  <time :datetime="new Date(time).toString()">
    {{ moment(time).fromNow() }}
  </time>
</template>

<script>
import moment from 'moment'
moment.locale(window.navigator.language)

export default {
  props: ['time'],
  methods: { moment }
}
</script>
