import http from '@/axios/fetch';
import { definitions } from '@/types/api.d';
import { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue-findsoft';
import { Commit } from 'vuex';

const axios = http.http;
const state = {
  remember: false,
  userProfile: {} as definitions['LoginUserResponse'],
  user: {} as definitions['User'],
  teacherData: [] as definitions['Page«User»'],
  sutdentData: [] as definitions['PageResponse«ClassMember»'],
};
const mutations = {
  pulRemember(store: { remember: boolean }, remember: boolean) {
    store.remember = remember;
  },
  pulUserProfile(store: { userProfile: definitions['LoginUserResponse'] }, userProfile: definitions['LoginUserResponse']) {
    if (userProfile.role) {
      sessionStorage.setItem('role', userProfile.role);
    }
    store.userProfile = userProfile;
  },
  pulUser(store: { user: definitions['User'] }, user: definitions['User']) {
    console.log(user);

    store.user = user;
  },
  pulteacherData(store: {teacherData: definitions['Page«User»']}, teacherData: definitions['Page«User»']) {
    store.teacherData = teacherData;
  },
  pulStudentData(store: {sutdentData: definitions['PageResponse«ClassMember»']}, sutdentData: definitions['PageResponse«ClassMember»']) {
    store.sutdentData = sutdentData;
  },

};
const getters = {
  token(store: { userProfile: definitions['LoginUserResponse'] }): string | null {
    if (store.userProfile.token) {
      return store.userProfile.token;
    } if (localStorage.token) {
      return localStorage.token;
    } if (sessionStorage.token) {
      return sessionStorage.token;
    }
    return null;
  },
  role(store: { userProfile: definitions['LoginUserResponse'] }): string | null {
    if (sessionStorage.role) {
      return sessionStorage.role;
    }
    return store.userProfile.role || null;
  },
  code(store: {userProfile: definitions['LoginUserResponse'] }): string {
    return store.userProfile.code || '';
  },
  teacherList(store: {teacherData: definitions['Page«User»']}): definitions['Page«User»'] {
    return store.teacherData;
  },
  studentList(store: {sutdentData: definitions['PageResponse«ClassMember»']}): definitions['PageResponse«ClassMember»'] {
    return store.sutdentData;
  },
};
const actions = {
  // 获取用户个人信息
  getByCode({ commit }: { commit: Commit }) {
    return new Promise((resolve, reject) => {
      if (!getters.token(state)) {
        return;
        // reject(Error('token为空'));
      }
      axios.post('./api/user/checkToken', { token: getters.token(state) }).then((res) => {
        const { data } = res.data;
        commit('pulUserProfile', data);
        axios.post('./api/user/getByCode', {
          code: data.code,
        }).then((User) => {
          const user = User.data.data;
          commit('pulUser', user);
        });
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // 创建用户
  addUser(_: unknown, AddUserRequest: definitions['AddUserRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/user/addUser', AddUserRequest).then((res) => {
        const { data } = res.data;
        console.log(data);
        message.success('添加用户成功！');
        resolve(data);
      }).catch((err) => {
        message.error(err);
        reject(err);
      });
    });
  },
  // 登陆
  login({ commit }: { commit: Commit }, LoginRequest: definitions['LoginRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/user/login', LoginRequest).then((res: AxiosResponse) => {
        const { data }: { data: definitions['LoginUserResponse'] } = res.data;
        commit('pulUserProfile', data);
        if (state.remember && data.token) {
          localStorage.setItem('token', data.token);
        } else if (data.token) {
          sessionStorage.setItem('token', data.token);
        }
        message.success('登陆成功！');
        resolve(data);
      }).catch((err) => {
        message.error(err);

        reject(err);
      });
    });
  },
  // 查询用户列表
  queryUserList({ commit }: { commit: Commit }, QueryUserRequest: definitions['QueryUserRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/user/queryUserList', QueryUserRequest).then((res) => {
        const { data } = res.data;
        commit('pulteacherData', data);
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  /**
   * 查询学生列表
   */
  queryStudentList({ commit }: {commit: Commit}, ListClassMemberRequest: definitions['ListClassMemberRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/classMember/listStudent', ListClassMemberRequest).then((res) => {
        const { data } = res.data;
        commit('pulStudentData', data);
        resolve();
      }).catch((err) => {
        reject(err);
        console.log(err);
      });
    });
  },
  // 添加用户到班级
  createClassMember(_: unknown, CreateOrUpdateClassMemberRequest: definitions['CreateOrUpdateClassMemberRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/classMember/createClassMember', CreateOrUpdateClassMemberRequest).then((res) => {
        const { data } = res;
        message.success('创建成功！');
        resolve(data);
      }).catch((err) => {
        message.error(err);
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
