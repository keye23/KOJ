import axios from "axios";
import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";

axios.defaults.timeout = 10000;

const NOT_LOGIN_CODE = 40100;

type ApiResponse = {
  code?: number;
  message?: string;
};

const redirectToLogin = () => {
  const currentRoute = router.currentRoute.value;
  if (currentRoute.path === "/user/login") {
    return;
  }
  store.commit("user/updateUser", {
    userAccount: "",
    userName: "未登录",
    userRole: ACCESS_ENUM.NOT_LOGIN,
  });
  router.replace({
    path: "/user/login",
    query: {
      redirect: currentRoute.fullPath,
    },
  });
};

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    const data = response.data as ApiResponse;
    if (data?.code === NOT_LOGIN_CODE) {
      redirectToLogin();
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axios;
