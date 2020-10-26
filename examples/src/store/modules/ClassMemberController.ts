import http from '@/axios/fetch';
import { definitions } from '@/types/api.d';
import { Commit } from 'vuex';
import { message } from 'ant-design-vue-findsoft';

const axios = http.http;

interface Stu {
  name: string;
  userId: string;
  className: string;
}
const state = {
  studentList: [] as Stu[],
};

const mutations = {
  pulstudentList(store: { studentList: Stu[] }, studentList: Stu[]) {
    store.studentList = studentList;
  },
};
const getters = {
  studentList(store: { studentList: Stu[] }): Stu[] {
    return store.studentList;
  },
};
const actions = {
  // 新建学生
  createOrUpdateMember(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    createOrUpdateClassMemberRequest: definitions['CreateOrUpdateClassMemberRequest'],
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post('./api/classMember/createClassMember', createOrUpdateClassMemberRequest)
        .then(() => {
          message.success('创建成功');
          resolve();
        })
        .catch((err) => {
          message.error(err);
          reject();
        });
    });
  },

  // 获取班级学生明细
  getClassStudent(
    { commit }: { commit: Commit },
    ListClassMemberRequest: definitions['ListClassMemberRequest'],
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post('./api/classMember/listStudent', ListClassMemberRequest)
        .then((res) => {
          const { list } = res.data.data;
          console.log('学生明细列表', list);
          const result: Stu[] = [];
          if (list) {
            list.forEach((item: {
              name: string;
              classMemberPk: {
                userId: string;
              };
              className: string;
            }) => {
              const obj = {
                name: item.name,
                userId: item.classMemberPk.userId,
                className: item.className,
              };
              result.push(obj);
            });
          }
          commit('pulstudentList', result);
          resolve(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          reject();
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
