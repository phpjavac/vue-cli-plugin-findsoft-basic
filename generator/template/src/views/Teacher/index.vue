<template lang="pug">
.teacher
  theHeader
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
  .container
    width 1180px
    height 613px
    margin 0 auto
    margin-top 49px
    >>>.ant-table table
      background #ffffff
    >>>.ant-table-tbody > tr.ant-table-row-selected td
      background rgba(74,144,226,0.16);
    >>>.ant-table-thead > tr > th, .ant-table-tbody > tr > td
      padding: 13px 16px;
    >>>.ant-table-thead > tr > th, .ant-table-tbody > tr > td
      padding 13px 16px
</style>
