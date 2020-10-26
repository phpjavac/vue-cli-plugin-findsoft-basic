<template lang="pug">
.teacher
  theHeader
  router-view
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  components: {
    theHeader: () => import('@/components/Teacher/header.vue'),
  },
});
</script>
<style lang="stylus" scoped>
.teacher
  min-height 100vh
  background #EEF2F5
</style>
