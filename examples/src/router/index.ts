import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store/index';
import Login from '../views/Login.vue';

const role = [['admin', 'teacher', 'student'], ['admin', 'teacher'], ['admin'], ['teacher'], ['student']];

/**
 * role 角色权限控制
 *@param arr[0] 所有角色都可进;
 *@param arr[1] 仅管理员教师可进;
 *@param arr[2] 仅管理员可进;
 *@param arr[3] 仅教师可进;
 *@param arr[4] 仅学生可进;
 *@param signIn 是否登陆后浏览
 */
const meta = (value: number, signIn: boolean): { role: Array<string>; signIn: boolean } => ({ role: role[value], signIn });

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    meta: meta(0, false),
    component: Login,
  },
  {
    path: '/Teacher',
    name: 'teacher',
    component: () => import(/* webpackChunkName: "teacher" */ '../views/Teacher/index.vue'),
    children: [
      {
        path: '/Teacher/userlist',
        name: 'teacher/userlist',
        meta: meta(2, true),
        component: () => import(/* webpackChunkName: "teacher/userlist" */ '../views/Teacher/userManage/userList.vue'),
      },
      {
        path: '/Teacher/classlist',
        name: 'teacher/classlist',
        meta: meta(1, true),
        component: () => import(/* webpackChunkName: "teacher/classlist" */ '../views/Teacher/classManage/classList.vue'),
      },
      {
        path: '/Teacher/userInfo',
        name: 'TeacherUserInfo',
        meta: meta(0, true),
        component: () => import(/* webpackChunkName: "teacher/userInfo" */ '../views/Public/UserInfo.vue'),
      },
    ],
  },
  {
    path: '/Student',
    component: () => import('../views/Student/index.vue'),
    children: [

    ],
  },
];

const router = new VueRouter({
  routes,
});

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

router.beforeEach((to, from, next) => {
  const token = store.getters['UserController/token'];
  const userRole: string = store.getters['UserController/role'];
  if (!userRole && to.name !== 'Login') {
    next('/');
  }
  if (!token && to.meta.signIn) {
    next('/');
  } else if (!token && !to.meta.signIn) {
    next();
  } else if (token && !to.meta.signIn) {
    next(routerPath[userRole]);
  } else if (token && to.meta.signIn) {
    if (to.meta.role.includes(userRole)) {
      next();
    } else {
      next(routerPath[userRole]);
    }
  }
});

export default router;
