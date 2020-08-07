<template lang="pug">
.login
  .model
  .header-title
    img.logo(src="static/logo/logo.png")
    .name {{ softConfig.softName }}
  .formModel
    .title 登陆
    .items
      a-input(placeholder="请输入账号", size="large", v-model="form.code")
    .items
      a-input(
        placeholder="请输入密码",
        size="large",
        type="password",
        @pressEnter="login",
        v-model="form.password"
      )
    .pass-text
      a-checkbox(v-model="remember") 记住密码
      a-button.fp-button(type="link") 忘记密码
    a-button.sure-button(block, type="primary", :loading="login") 登陆
    .login-footer
      .copyright {{softConfig.copyRightValue}}
      .line
      .text V3.0
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Input, Checkbox, Button } from 'ant-design-vue-findsoft';
import { definitions } from '@/types/api.d';

export default Vue.extend({
  data() {
    return {
      form: {
        code: '',
        password: '',
      } as definitions['LoginRequest'],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
  },
  components: {
    aInput: Input,
    aCheckbox: Checkbox,
    aButton: Button,
  },
  methods: {
    login() {
      return this.$store
        .dispatch('UserController/login', this.form)
        .then((data) => {
          this.$store.dispatch('UserController/getByCode');
          const { role } = data;
          const routerPath: {
            [index: string]: { path: string };
          } = {
            admin: {
              path: '/Teacher/userlist',
            },
            teacher: {
              path: '/Teacher/userlist',
            },
            student: {
              path: '/Student/home',
            },
          };
          this.$router.push(routerPath[role]);
        });
    },
  },
  computed: {
    ...mapGetters([
      'softConfig',
      // ...
    ]),
    remember: {
      get(): boolean {
        return this.$store.state.UserController.remember;
      },
      set(val: boolean): void {
        this.$store.commit('UserController/pulRemember', val);
      },
    },
  },
});
</script>
<style lang="stylus" scoped>
.login
  display flex
  align-items center
  justify-content center
  flex-direction column
  background url('../assets/img/login/bg.png') no-repeat
  background-color rgba(0, 0, 0, 0.6)
  background-size 100% 100%
  height 100vh
  width 100%
  min-height 100vh
  .model
    background rgba(29, 33, 48, 0.2)
    width 100%
    height 100%
    position fixed
    z-index 1
  .header-title
    display flex
    align-items center
    margin-bottom 36px
    z-index 2
    .logo
      width 44px
      height 34px
      margin-right 5px
    .name
      font-family MicrosoftYaHeiUI-Bold, MicrosoftYaHeiUI
      font-weight bold
      font-size 30px
      color rgba(255, 255, 255, 1)
  .formModel
    z-index 2
    position relative
    width 380px
    height 428px
    background rgba(255, 255, 255, 1)
    box-shadow 0px 2px 4px 0px rgba(0, 0, 0, 0.3)
    border-radius 8px
    position relative
    padding 28px 30px
    text-align center
    .title
      font-size 20px
      font-family MicrosoftYaHeiUI
      color rgba(42, 46, 54, 1)
      line-height 25px
    .items
      margin-top 28px
      margin-bottom 8px
    .pass-text
      display flex
      justify-content space-between
      .fp-button
        font-size 14px
        font-family MicrosoftYaHeiUI
        color rgba(128, 128, 128, 1)
    .sure-button
      height 40px
      margin-top 24px
    .login-footer
      position absolute
      bottom 28px
      .copyright
        font-size 14px
        line-height 18px
        font-family MicrosoftYaHeiUI
        color rgba(128, 128, 128, 1)
      .line
        width 320px
        height 1px
        line-height 18px
        background rgba(204, 204, 204, 1)
        margin-top 8px
        margin-bottom 8px
      .text
        font-size 14px
        line-height 18px
        font-family MicrosoftYaHeiUI
        color rgba(128, 128, 128, 1)
</style>
