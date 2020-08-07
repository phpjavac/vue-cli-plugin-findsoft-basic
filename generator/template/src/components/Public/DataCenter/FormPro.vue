<template lang="pug">
  a-modal(:visible="visible",:title="title",@cancel="onCancel",@ok="onOk")
    a-form-model(:model="localForm",layout="vertical")
      a-form-model-item(label="排序",:labelCol="{span: 4}",:wrapperCol="{span: 20}",prop="")
        a-input-number(v-model="localForm.seq")
      a-form-model-item(label="名词",:labelCol="{span: 4}",:wrapperCol="{span: 20}")
        a-input(v-model="localForm.title",)
      a-form-model-item(label="解释",:labelCol="{span: 4}",:wrapperCol="{span: 20}")
        a-input(v-model="localForm.content",type="textarea")
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import cloneDeep from 'lodash/cloneDeep';

interface Form {
  id?: string;
  title: string;
  content: string;
}
@Component({
  name: 'FormPro',
})
export default class FormPro extends Vue {
  @Prop({ required: true, default() { return { id: '' }; } })
  private form!: {id?: string}

  get isCreate() {
    return this.form.id && !!this.form.id;
  }

  get title() {
    return this.isCreate ? '添加名词' : '修改名词';
  }

  private visible = false

  private localForm: {id?: string} = { id: '' }

  @Watch('visible')
  private onVisibleChange(newVal: boolean) {
    if (newVal) {
      this.localForm = cloneDeep(this.form);
    }
  }

  onOk() {
    this.visible = false;
  }

  onCancel() {
    this.visible = false;
  }
}
</script>
<style lang="stylus" scoped>

</style>
