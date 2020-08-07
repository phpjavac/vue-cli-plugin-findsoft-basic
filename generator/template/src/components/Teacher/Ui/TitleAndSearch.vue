<template lang="pug">
.top-bar
  div(v-if="multiple")
    a-radio-group(
      :default-value="activeTitle",
      button-style="solid"
    )
      a-radio-button(v-for="(item,index) in title", :value="item", :key="item", @click="changeActive($event,index)") {{ item }}
  p(v-else) {{ activeTitle }}
  .search
    a-input-search(placeholder="搜索关键字")
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import { Input, Icon, Radio } from 'ant-design-vue-findsoft';

Vue.use(Input);
Vue.use(Radio);
export default Vue.extend({
  name: 'TheTitleAndSearch',
  props: {
    title: { type: Array as PropType<string[]>, required: true },
    active: Number,
  },
  components: {
    aIcon: Icon,
  },
  computed: {
    multiple(): boolean {
      return !(this.title.length === 1);
    },
    activeTitle(): string {
      if (this.title.length === 1) {
        return this.title[0];
      }
      return this.title[this.active || 0];
    },
  },
  methods: {
    changeActive(e: Event, index: number) {
      if (e.target) {
        // eslint-disable-next-line
        if((e.target as HTMLInputElement).value) this.$emit('change', (e.target as HTMLInputElement).value, index);
      }
    },
  },
});
</script>
<style lang="stylus" scoped>
.top-bar
  display flex
  justify-content space-between
  padding-left 4px
  >>>.ant-input-suffix
    color rgba(198, 198, 198, 1)
  p
    width 96px
    height 32px
    font-size 24px
    font-family MicrosoftYaHeiUI
    color rgba(42, 46, 54, 1)
    line-height 32px
  .search
    width 240px
    display block
</style>
