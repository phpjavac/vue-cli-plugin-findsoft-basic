import Vue from 'vue';
import Vuex from 'vuex';
import { definitions } from '@/types/api.d';
import UserController from './modules/UserController';
import SystemController from './modules/SystemController';
import ClassController from './modules/ClassController';
import ClassMemberController from './modules/ClassMemberController';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    softConfig(): definitions['SoftConfigResult'] {
      return SystemController.state.SoftConfig;
    },
    user(): definitions['User'] {
      return UserController.state.user;
    },
  },
  modules: {
    UserController,
    SystemController,
    ClassController,
    ClassMemberController
  },
});
