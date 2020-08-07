<template lang="pug">
  a-modal(:visible="visible",:title="title",@cancel="onCancel",@ok="onOk")
    a-form-model(:model="localForm",layout="vertical")
      a-form-model-item(label="排序",:labelCol="{span: 4}",:wrapperCol="{span: 20}",prop="")
        a-input-number(v-model="localForm.seq")
      a-form-model-item(label="标题",:labelCol="{span: 4}",:wrapperCol="{span: 20}")
        a-input(v-model="localForm.title",)
      a-form-model-item(label="资料简介",:labelCol="{span: 4}",:wrapperCol="{span: 20}")
        a-input(v-model="localForm.content",type="textarea")
      template(v-if="isCreate")
        a-form-model-item(label="上传文件",:labelCol="{span: 4}",:wrapperCol="{span: 20}")
          a-upload(:before-upload="beforeUpload",:file-list="fileList",@change="onFileChange")
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import cloneDeep from 'lodash/cloneDeep';
import { Doc } from '@/regex';

interface Form {
  id?: string;
  title: string;
  content: string;
}
@Component({
  name: 'FormLearn',
})
export default class FormLearn extends Vue {
  @Prop({ required: true, type: Object, default() { return {}; } })
  private form!: Form

  get isCreate() {
    return !this.form.id;
  }

  get title() {
    return this.isCreate ? '上传学习资料' : '修改学习资料';
  }

  private visible = false

  private localForm: Form = cloneDeep(this.form)

  @Watch('visible', { deep: true })
  private onVisibleChange = (newVal: any) => {
    if (newVal) {
      console.log('newVla', newVal, cloneDeep(this.form));
      // this.$set(this, 'localFOrm', newVal);
      this.localForm = cloneDeep(this.form);
    }
  }

  onOk() {
    this.visible = false;
  }

  onCancel() {
    this.visible = false;
  }

  beforeUpload(file: any) {
    const isJpgOrPng = Doc.regex.test(file.type);
    if (!isJpgOrPng) {
      this.$message.error(Doc.errorMsg);
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      this.$message.error('文件大小必须小于20M');
    }
    return false;
  }

  private fileData!: FormData|null

  private fileList: any = []

  onFileChange(fileList: any) {
    if (!fileList.fileList.length) {
      this.fileData = null;
    } else {
      this.fileData = new FormData();
      this.fileData.append('file', fileList.file);
    }
    this.fileList = [...fileList.fileList];
    // 单次只允许上传一个文件
    if (this.fileList.length > 1) {
      this.fileList.shift();
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
