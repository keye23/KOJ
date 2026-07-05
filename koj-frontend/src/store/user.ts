import { ActionContext, Module } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { LoginUserVO, UserControllerService } from "../../generated";

export type UserState = {
  loginUser: LoginUserVO;
};

export type RootState = {
  user: UserState;
};

const user: Module<UserState, RootState> = {
  namespaced: true,
  state: () => ({
    loginUser: {
      userAccount: "",
      userName: "未登录",
      userRole: ACCESS_ENUM.NOT_LOGIN,
    },
  }),
  actions: {
    async getLoginUser({ commit, state }: ActionContext<UserState, RootState>) {
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state: UserState, payload?: LoginUserVO) {
      if (payload) {
        state.loginUser = { ...payload };
      }
    },
  },
};

export default user;
