import Vue from 'vue';
import Vuex from 'vuex';
import { definitions } from '@/types/api.d';
import UserController from './axios/UserController';
import SystemController from './axios/SystemController';
import ClassController from './axios/ClassController';

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
  },
});
