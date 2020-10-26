import http from '@/axios/fetch';
import { definitions } from '@/types/api.d';
import { message } from 'ant-design-vue-findsoft';
import { Commit } from 'vuex';

const axios = http.http;

const state = {
  classInfo: {} as definitions['Page«Class»'],
};
// MergeClassRequest
const mutations = {
  // 请求到班级数据后的mutation
  pulClassInfo(
    store: { classInfo: definitions['Page«Class»'] },
    classInfo: definitions['Page«Class»'],
  ) {
    store.classInfo = classInfo;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    MergeClassRequest: definitions['MergeClassRequest'],
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post('./api/class/createOrUpdateClass', MergeClassRequest)
        .then((res) => {
          const { data } = res.data;
          resolve(data);
        })
        .catch((err) => {
          message.error('err');
          reject(err);
        });
    });
  },
  // 获取 查询 班级信息
  getClassInfo(
    { commit }: { commit: Commit },
    QueryClassRequest: definitions['QueryClassRequest'],
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post('./api/class/queryClass', QueryClassRequest)
        .then((res) => {
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
  // 删除班级
  delCls(_: unknown, BatchDeletingRequest: definitions['BatchDeletingRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/userManage/delClass', BatchDeletingRequest).then((res) => {
        message.success('删除班级成功');
        resolve(res.data.data);
      }).catch((err) => {
        message.info(err);
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
