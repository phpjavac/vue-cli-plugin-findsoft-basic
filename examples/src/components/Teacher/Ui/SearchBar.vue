<template lang="pug">
.search
  a-input-search(placeholder="搜索关键字", @search="onSearch")
</template>
<script lang="ts">
import Vue from 'vue';
import { Input, Icon } from 'ant-design-vue-findsoft';

Vue.use(Input);
export default Vue.extend({
  name: 'SearchBar',
  components: {
    aIcon: Icon,
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch(value: string) {
      this.$emit('inputSearch', value);
    },
  },
});
</script>
<style lang="stylus" scoped>
.search
  width 240px
  display block
</style>
