import Vue from 'vue';
import Vuex from 'vuex';
// import Info from './info';
import User from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    // info: Info,
    user: User
  }
  // plugins: [PersistedPlugin]
});
