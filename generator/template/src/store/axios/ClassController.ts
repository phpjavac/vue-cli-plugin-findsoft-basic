import http from '@/axios/fetch';
import { definitions } from '@/types/api.d';
import { Commit } from 'vuex';

const axios = http.http;

const state = {
  classInfo: {} as definitions['Page«Class»'],
};
// MergeClassRequest
const mutations = {
  pulClassInfo(
    store: { classInfo: definitions['Page«Class»'] },
    classInfo: definitions['Page«Class»'],
  ) {
    store.classInfo = classInfo;
  },
  updatePulClassInfo(
    store: { classInfo: definitions['Page«Class»'] },
    newClassInfo: definitions['Class'],
  ) {
    if (store.classInfo.list) {
      store.classInfo.list.unshift(newClassInfo);
    }
  },
};
const getters = {
  classInfo(store: { classInfo: definitions['Page«Class»'] }): definitions['Page«Class»'] {
    return store.classInfo;
  },
};
const actions = {
  // 新建 更新班级信息
  updateClassInfo(
    { commit }: { commit: Commit },
    MergeClassRequest: definitions['MergeClassRequest'],
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post('./api/class/createOrUpdateClass', MergeClassRequest)
        .then((res) => {
          console.log(res);
          const { data } = res.data;
          commit('updatePulClassInfo', data);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 获取班级信息
  getClassInfo(
    { commit }: { commit: Commit },
    QueryClassRequest: definitions['QueryClassRequest'],
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post('./api/class/queryClass', QueryClassRequest)
        .then((res) => {
          console.log(res, 'getClassInfo');
          const { data } = res.data;
          commit('pulClassInfo', data);
          resolve(data);
        })
        .catch((err) => {
          console.log(err);
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
