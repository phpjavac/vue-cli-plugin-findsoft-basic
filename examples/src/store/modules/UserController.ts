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
    if (state.remember && userProfile.token) {
      if (userProfile.role) {
        localStorage.setItem('role', userProfile.role);
      } if (userProfile.code) {
        localStorage.setItem('code', userProfile.code);
      }
      localStorage.setItem('token', userProfile.token);
    } else if (userProfile.token) {
      if (userProfile.role) {
        sessionStorage.setItem('role', userProfile.role);
      } if (userProfile.code) {
        sessionStorage.setItem('code', userProfile.code);
      }
      sessionStorage.setItem('token', userProfile.token);
    }
    store.userProfile = userProfile;
  },
  pulUser(store: { user: definitions['User'] }, user: definitions['User']) {
    store.user = user;
  },
  pulteacherData(store: { teacherData: definitions['Page«User»'] }, teacherData: definitions['Page«User»']) {
    store.teacherData = teacherData;
  },
  pulStudentData(store: { sutdentData: definitions['PageResponse«ClassMember»'] }, sutdentData: definitions['PageResponse«ClassMember»']) {
    store.sutdentData = sutdentData;
  },

};
const getters = {
  user(store: {
    user: definitions['User'];
  }): definitions['User'] {
    return store.user;
  },
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
    } if (localStorage.role) {
      return localStorage.role;
    }
    return store.userProfile.role || null;
  },
  code(store: { userProfile: definitions['LoginUserResponse'] }): string {
    if (sessionStorage.code) {
      return sessionStorage.code;
    } if (localStorage.code) {
      return localStorage.code;
    }
    return store.userProfile.code || '';
  },
  teacherList(store: { teacherData: definitions['Page«User»'] }): definitions['Page«User»'] {
    return store.teacherData;
  },
  studentList(store: { sutdentData: definitions['PageResponse«ClassMember»'] }): definitions['PageResponse«ClassMember»'] {
    return store.sutdentData;
  },
};
const actions = {

  changeUserInfo(_: unknown, ChangeUserInfo: definitions['ChangeUserInfoRequest']) {
    return new Promise<void>((resolve, reject) => {
      axios.post('./api/user/changeUserInfo', ChangeUserInfo).then(() => {
        message.success('编辑用户成功');
        resolve();
      }).catch((err) => {
        message.error(err);
        reject(err);
      });
    });
  },
  // 获取用户个人信息
  getByCode({ commit }: { commit: Commit }) {
    return new Promise((resolve, reject) => {
      if (!getters.token(state)) {
        console.log('token为空');
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
        message.success('添加用户成功！');
        resolve(data);
      }).catch((err) => {
        message.error(err);
        reject(err);
      });
    });
  },
  // 登录
  login({ commit }: { commit: Commit }, LoginRequest: definitions['LoginRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/user/login', LoginRequest).then((res: AxiosResponse) => {
        const { data }: { data: definitions['LoginUserResponse'] } = res.data;
        commit('pulUserProfile', data);
        message.success({
          content: '登录成功',
          close: true,
        });
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
  queryStudentList({ commit }: { commit: Commit }, ListClassMemberRequest: definitions['ListClassMemberRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/classMember/listStudent', ListClassMemberRequest).then((res) => {
        const { data } = res.data;
        commit('pulStudentData', data);
        resolve(data);
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
  /**
   * 重置用户密码为123456
   */
  resetPassword(_: unknown, BaseUserCodeRequest: definitions['BaseUserCodeRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/user/adminResetPassword', BaseUserCodeRequest).then((res) => {
        const { data } = res;
        message.success('重置密码成功');
        resolve(data);
      }).catch((err) => {
        message.error(err);
        reject(err);
      });
    });
  },
  // 修改密码
  changePassword(_: unknown, ChangePasswordRequest: definitions['ChangePasswordRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/user/changePassword', ChangePasswordRequest).then((res) => {
        message.success('密码修改成功');
        resolve(res.data.data);
      }).catch((err) => {
        message.error(err);
        reject(err);
      });
    });
  },

  /**
   * 编辑个人姓名和签名
   */
  changeUserSignature(_: unknown, ChangeUserSignatureRequest: definitions['ChangeUserSignatureRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/user/changeUserSignature', ChangeUserSignatureRequest).then((res) => {
        message.success('保存个人信息成功');

        resolve(res.data.data);
      }).catch((err) => {
        message.info(err);
        reject(err);
      });
    });
  },
  // 删除学生账号
  delStuUser(_: unknown, BatchDeletingRequest: definitions['BatchDeletingRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/userManage/delStuUser', BatchDeletingRequest).then((res) => {
        message.success('删除用户成功');
        resolve(res.data.data);
      }).catch((err) => {
        message.info(err);
        reject(err);
      });
    });
  },
  // 删除教师账号
  delTeaUser(_: unknown, BatchDeletingRequest: definitions['BatchDeletingRequest']) {
    return new Promise((resolve, reject) => {
      axios.post('./api/userManage/delTeaUser', BatchDeletingRequest).then((res) => {
        message.success('删除用户成功');
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
