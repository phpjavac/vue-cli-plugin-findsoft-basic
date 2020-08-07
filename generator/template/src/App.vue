<template lang="pug">
#app
  a-config-provider(:locale="locale")
    router-view
</template>
<script lang="ts">
import Vue from 'vue';
import { ConfigProvider } from 'ant-design-vue-findsoft';
import zhCN from 'ant-design-vue-findsoft/lib/locale-provider/zh_CN';

export default Vue.extend({
  components: {
    aConfigProvider: ConfigProvider,
  },
  data() {
    return {
      locale: zhCN,
    };
  },
  created() {
    this.$store.dispatch('SystemController/getSoftConfig');
    this.$store.dispatch('UserController/getByCode');
  },
});
</script>
