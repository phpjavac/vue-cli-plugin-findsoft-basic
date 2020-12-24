<template lang="pug">
.user-info
  .left-info
    .head-image
      img(:src='user.headImagePath')
      .name {{ user.name }}
      .code id: {{ user.code }}
    .tabs
      .tab-item(:class='{ active: title === "我的资料" }', @click='title = "我的资料"') 我的资料
      .tab-item(:class='{ active: title === "修改密码" }', @click='title = "修改密码"') 修改密码
  .right-info
    .title {{ title }}
    .user-container(v-if='title === "我的资料"')
      a-form-model(
        :model='form',
        :label-col='labelCol',
        :wrapper-col='wrapperCol'
      )
        a-form-model-item(label='头像')
          img(:src='user.headImagePath', style='width:80px;')
        a-form-model-item(label='账号')
          div {{ user.code }}
        a-form-model-item(label='班级')
          div {{ user.code }}
        a-form-model-item(label='姓名')
          a-input(v-model='form.name')
        a-form-model-item(label='个人简介', :wrapperCol='{ span: 14 }')
          a-input(
            v-model='form.personalSignature',
            type='textarea',
            :maxLength='500'
          )
        .buttons(style='padding-left: 8%;')
          a-button(type='primary', @click='ok') 确定
          a-button(style='margin-left: 12px;', @click='back') 取消
    .user-container(v-if='title === "修改密码"')
      a-form-model(
        :model='formPassWord',
        :label-col='labelCol',
        :wrapper-col='wrapperCol'
      )
        a-form-model-item(label='原密码')
          a-input-password.password(
            v-model='formPassWord.oldPassword',
            placeholder='请输入现在使用的密码'
          )
        a-form-model-item(label='新密码')
          a-input-password.password(
            v-model='formPassWord.newPassword',
            placeholder='8位数以上的新密码'
          )
        a-form-model-item(label='确认密码')
          a-input-password.password(v-model='password', placeholder='请再次输入新密码')
        .buttons(style='padding-left: 8%;')
          a-button(type='primary', @click='passWordOk') 确定
          a-button(style='margin-left: 12px;', @click='back') 取消
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {
  FormModel, Input, message, Button,
} from 'ant-design-vue-findsoft';

Vue.use(Input);
Vue.use(FormModel);
export default Vue.extend({
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 4 },
      title: '我的资料',
      form: {
        code: '',
        name: '',
        personalSignature: '',
      },
      formPassWord: {
        code: '',
        newPassword: '',
        oldPassword: '',
      },
      password: '',
    };
  },
  watch: {
    user: {
      deep: true,
      immediate: true,
      handler(val) {
        this.formPassWord.code = val.code;
        this.form.code = val.code;
        this.form.name = val.name;
        this.form.personalSignature = val.personalSignature;
      },
    },
  },
  components: {
    aButton: Button,
  },
  computed: {
    ...mapGetters('UserController', ['user']),
  },
  methods: {
    ...mapActions('UserController', [
      'changeUserSignature',
      'getByCode',
      'changePassword',
    ]),
    back() {
      this.$router.go(-1);
    },
    passWordOk() {
      return new Promise((resolve, reject) => {
        if (this.formPassWord.newPassword !== this.password) {
          message.info('两次密码输入不一致！');
          return;
        }
        if (this.formPassWord.newPassword.length < 8) {
          message.info('密码长度过短！');
          return;
        }
        this.changePassword(this.formPassWord)
          .then((res) => {
            this.formPassWord.newPassword = '';
            this.formPassWord.oldPassword = '';
            this.password = '';
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            console.log('finally');
          });
      });
    },
    ok() {
      this.changeUserSignature(this.form).then(async () => {
        await this.getByCode();
      });
    },
  },
});
</script>
<style lang="stylus" scoped>
.password
  width 190px
.user-info
  display flex
  .left-info
    max-width 282px
    min-width 282px
    .head-image
      background #fff
      text-align center
      padding 28px
      img
        width 92px
        height 92
        border-radius 50%
      .name
        font-size 16px
        font-family PingFangSC-Medium, PingFang SC
        font-weight 500
        color rgba(42, 46, 54, 0.75)
        margin-top 12px
        margin-bottom 4px
      .code
        font-size 12px
        font-family PingFangSC-Medium, PingFang SC
        font-weight 500
        color rgba(153, 153, 153, 1)
    .tabs
      background #ffffff
      margin-top 16px
      padding 16px 0
      .tab-item
        cursor pointer
        font-size 14px
        font-family PingFangSC-Regular, PingFang SC
        font-weight 400
        color rgba(42, 46, 54, 0.75)
        padding-left 48px
        height 40px
        line-height 40px
        border-left 2px solid #fff
      .active
        background rgba(242, 250, 255, 1)
        border-left 2px solid #498CE9
        color rgba(73, 140, 233, 1)
  .right-info
    margin-left 24px
    flex 1
    background #ffffff
    padding 16px 24px
    .title
      font-size 20px
      font-family PingFangSC-Regular, PingFang SC
      font-weight 400
      color rgba(0, 0, 0, 0.85)
      height 60px
      line-height 60px
      border-bottom 1px solid #F2F3F5
    .user-container
      padding 28px 0
</style>
