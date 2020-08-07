<template lang="pug">
.dc-wrap
  TheTitleAndSearch(:title="titleList",@change="onTabChange").mb22
  a-table(:data-source="dataSource",:columns="columns").mb22
    template(slot="action",slot-scope="text,record")
      a-button(type="link",icon="edit",@click="dispatchEdit(record)") 编辑
      a-button(type="link",icon="export",@click="dispatchExport(record)",v-if="activeTab===0") 导出
      a-button(type="link",icon="share-alt",@click="dispatchShare(record)") 分享
      a-button(type="link",icon="delete",@click="dispatchDel(record)") 删除
  FormLearn(:form="formLearn",ref="formLearn")
  FormPro(:form="formPro",ref="formPro")
  FormLink(:form="formLink",ref="formLink")
  .dib
    a-button(type="primary",@click="dispatchForm(false)") 新建
    template(v-if="selectedList.length")
      a-button(type="primary",@click="batchExport").mr16 导出
      a-button(type="primary",@click="batchShare").mr16 分享
      a-button(type="primary",@click="batchDel").mr16 删除
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator';
import { cloneDeep } from 'lodash';
import FormLearn from '@/components/Public/DataCenter/FormLearn.vue';
import FormPro from '@/components/Public/DataCenter/FormPro.vue';
import FormLink from '@/components/Public/DataCenter/FormLink.vue';

@Component({
  name: 'DataCenter',
  components: {
    FormLearn,
    FormPro,
    FormLink,
    TheTitleAndSearch: () => import('@/components/Teacher/Ui/TitleAndSearch.vue'),
  },
})
export default class DataCenter extends Vue {
  private titleList: Array<string> = ['学习资料', '专业名称', '网络链接']

  // 当前tab索引
  private activeTab = 0;

  // 学习资料表格配置
  private colLearn: Array<object> = []

  // 专业名称表格配置
  private colPro: Array<object> = []

  // 网络链接表格配置
  private colLink: Array<object> = []

  // 学习资料列表
  private dataLearn: Array<object> = []

  // 专业名称列表
  private dataPro: Array<object> = []

  // 网络链接列表
  private dataLink: Array<object> = []

  private formLearn = { id: '', title: '234', content: '' }

  private formPro = {}

  private formLink = {}

  // 表格选中数据列表
  private selectedList: Array<object> = []

  private pagination: object = {
    total: 0,
    pageSize: 10,
    current: 1,
    showSizeChanger: false,
    // pageSizeOptions: ['10', '20', '30', '40', '50'],
    hideOnSinglePage: false,
  }

  // 根据tab获取表格配置
  get columns() {
    switch (this.activeTab) {
      case 1:
        return this.colLink;
      case 2:
        return this.colPro;
      default:
        return this.colLearn;
    }
  }

  get dataSource() {
    switch (this.activeTab) {
      case 1:
        return this.dataLink;
      case 2:
        return this.dataPro;
      default:
        return this.dataLearn;
    }
  }

  onTabChange(name: string, index: number) {
    this.activeTab = index;
  }

  dispatchForm(record: any) {
    switch (this.activeTab) {
      case 1:
        (this.$refs.formPro as any).visible = true;
        if (record) this.formPro = cloneDeep(record);
        break;
      case 2:
        (this.$refs.formLink as any).visible = true;
        if (record) this.formLink = cloneDeep(record);
        break;
      default:
        (this.$refs.formLearn as any).visible = true;
        console.log(!!record);
        if (record) this.formLearn = cloneDeep(record);
    }
  }

  dispatchEdit(record: any) {
    this.dispatchForm(record);
  }

  dispatchExport(record: any) {
    console.log(record, this);
  }

  dispatchShare(record: any) {
    console.log(record, this);
  }

  dispatchDel(record: any) {
    console.log(record, this);
  }
}
</script>
<style lang="stylus" scoped>
.dib
  display inline-block
.mr16
  margin-right 16px
.mb22
  margin-bottom 22px
.dc-wrap
  width 1180px
  margin 46px auto 46px auto
</style>
