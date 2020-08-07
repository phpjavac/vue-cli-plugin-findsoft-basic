import http from '@/axios/fetch';
import { definitions } from '@/types/api.d';
import { Commit } from 'vuex';

const axios = http.http;
const state = {
  SoftConfig: {

  }as definitions['SoftConfigResult'],
};
const mutations = {
  pulSoftConfig(store: { SoftConfig: definitions['SoftConfigResult'] }, SoftConfig: definitions['SoftConfigResult']) {
    document.title = SoftConfig.softName || '';

    store.SoftConfig = SoftConfig;
  },
};
const getters = {
  SoftConfig(store: { SoftConfig: definitions['SoftConfigResult'] }): definitions['SoftConfigResult'] {
    return store.SoftConfig;
  },
};
const actions = {
  getSoftConfig({ commit }: { commit: Commit }) {
    return new Promise((resolve, reject) => {
      axios.get('./softConfig/get').then((res) => {
        const { data } = res;
        commit('pulSoftConfig', data);
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
