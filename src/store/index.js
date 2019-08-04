import Vue from 'vue';
import Vuex from 'vuex';
// import Info from './info';
import User from './user';

Vue.use(Vuex);

const PersistedPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    console.warn('PersistedPlugin:', mutation);
  });
};

export default new Vuex.Store({
  modules: {
    // info: Info,
    user: User
  },
  strict: true,
  namespace: true,
  plugins: [PersistedPlugin]
});
