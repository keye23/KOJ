import { createStore } from "vuex";
import user from "./user";
import { RootState } from "./user";

export default createStore<RootState>({
  mutations: {},
  actions: {},
  modules: {
    user,
  },
});
