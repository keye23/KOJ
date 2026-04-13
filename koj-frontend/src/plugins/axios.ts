import axios from "axios";

// 创建实例（走代理）
const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// ✅ 给 request 实例加拦截器（不是全局 axios！）
request.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function (response) {
    console.log("响应成功", response);
    return response;
  },
  function (error) {
    console.error("响应失败", error);
    return Promise.reject(error);
  }
);

export default request;
