import Vue from 'vue';

const State = {
  // 登录基础信息
  loginfo: null,
  userinfo: null
};

// 同步立即更新
const MutAtions = {
  /**
   * 登录成功基础信息
   * @param state
   * @param loginfo
   */
  logInfo(state, loginfo) {
    // loginfo
    state.loginfo = loginfo;
  },
  logout(state) {
    // loginfo
    state.loginfo = null;
    // userinfo
    state.userinfo = null;
    // 缓存销毁
    // PersistedClear.remove('user/setLogInfo');
  }
};

// 异步请求数据
const Actions = {

  // 登录
  login(context, params) {
    return this.dispatch(
      this.interceptor,
      {
        type: 'user/login',
        handler() {
          return Vue.http.post('/api/v2/user-system/login/login', params)
                    .then(({ data }) => {
                      // Please don't commit here, otherwise you can't automatically restore the cache to state.
                      return Promise.resolve(data);
                    })
                    .catch(reason => {
                      return Promise.reject(reason);
                    });
        },
        success(data) {
          console.warn('success:', data);
          context.commit('logInfo', data.data);
        },
        error(reason) {
          console.warn('error:', reason);
        }
      }
    );
  },
  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // 预留日后需要同步登出到服务端
      const result = true;
      if (result) {
        commit('setLogout');
        resolve();
      }
      else {
        reject();
      }
    });
  }
};

const Getters = {
  loginfo: state => state.loginfo,
  userinfo: state => state.userinfo,
  token(state) {
    return state.loginfo ? state.loginfo.token : null;
  }
};

export default {
  namespaced: true,
  state: State,
  getters: Getters,
  mutations: MutAtions,
  actions: Actions
};
