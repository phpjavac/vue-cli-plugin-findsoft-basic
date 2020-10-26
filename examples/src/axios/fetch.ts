import { Modal } from 'ant-design-vue-findsoft';
import axios from 'axios';

const { CancelToken } = axios;
const source = CancelToken.source();
const http = axios.create({
  baseURL: '',
  timeout: 8000,
  headers: {},
});

let token = '';

if (localStorage.token) {
  token = localStorage.token;
} if (sessionStorage.token) {
  token = sessionStorage.token;
}

// 是否携带cookie
http.defaults.withCredentials = true;
if (sessionStorage.getItem('token')) {
  http.defaults.headers.common.token = token;
}

http.interceptors.request.use((config) => {
  if (localStorage.token) {
    token = localStorage.token;
  } if (sessionStorage.token) {
    token = sessionStorage.token;
  }
  // 在发送请求之前做些什么
  config.headers.token = token;
  return config;
}, (error) => Promise.reject(error));
// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 对响应数据做点什么
  response.config.cancelToken = source.token;
  if (response.data.success) {
    return response;
  }
  if (response.data.tokenValidateError) {
    source.cancel(response.data.message);
    Modal.error({
      title: '错误',
      content: response.data.message,
      onOk() {
        sessionStorage.clear();
        window.location.href = '/';
      },
    });
  }
  return Promise.reject(response.data.message);
}, (error) => Promise.reject(error));

export default {
  http,
};
