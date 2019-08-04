import Vue from 'vue';
// import { PersistedClear, PersistedAction, PersistedConfig, STORAGE_TYPE } from '../../packages/PersistedState';

// PersistedConfig.batch([
//   { type: 'user/setLogInfo', storage: STORAGE_TYPE.cookie, expire: 1800 }, // 保持登录30分钟
//   { type: 'user/setAppInfo', storage: STORAGE_TYPE.localStorage, expire: 1800 } // 保持登录30分钟
// ]);

const State = {
  // 登录基础信息
  loginfo: null,
  // 用户详细信息
  userinfo: null
  // acountinfo: null
};

// 同步立即更新
const MutAtions = {
  /**
   * 登录成功基础信息
   * @param state
   * @param loginfo
   */
  setLogInfo(state, loginfo) {
    // loginfo
    state.loginfo = loginfo;
  },
  setLogout(state) {
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
  // persist: PersistedAction,
  // 备用 => 留用于后期登录结构修改
  // 登录
  login({ dispatch, commit }, params) {
    // return dispatch('persist', {
    //   type: 'user/setLogInfo',
    //   getData() {
    return new Promise((resolve, reject) => {
      // TODO: 持久存储拦截时，简化入参的 Promise
      // TODO: 如何过滤返回值，并进行持久存储
      Vue.http.post('/api/v2/user-system/login/login', params).then((data) => {
        commit('setLogInfo', Object.freeze(data));

        // if (data.code === '10000') {
        //   // 检测 token 有效性
        //   if (data.data && data.data.token) {
        //     resolve(data.data);
        //   }
        //   else {
        //     reject(new Error('登录失败或服务器异常'));
        //   }
        // }
        // else {
        //   reject(new Error(data['sub_msg'] || data.msg));
        // }
      });
    });
    //   }
    // });
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
  userinfo: state => state.userinfo,
  // acountinfo: state => state.acountinfo,
  token(state) {
    return state.loginfo ? state.loginfo.token : null;
  },
  shopId(state) {
    let shopId = '';
    if (state.userinfo) {
      let { parent_id, shopper_id, user_type } = state.userinfo;
      shopId = user_type === 'chlid_shop' ? parent_id : shopper_id;
    }
    return shopId;
  }
};

export default {
  namespaced: true,
  strict: true,
  state: State,
  getters: Getters,
  mutations: MutAtions,
  actions: Actions
};
