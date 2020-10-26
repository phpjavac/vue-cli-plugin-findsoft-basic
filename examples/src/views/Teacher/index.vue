<template lang="pug">
.teacher
  the-header
  router-view.container
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
  text-align center
  .container
    padding 0 90px 0 110px
    margin 0 auto
    margin-top 24px
    text-align left
    >>>.ant-table table
      background #ffffff
    >>>.ant-table-tbody > tr.ant-table-row-selected td
      background rgba(74,144,226,0.16);
</style>
