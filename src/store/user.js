import Vue from 'vue';
import EasyStore, { merge, increment } from '@mudas/store';

const USER_LOGIN = 'login';
const USER_LOGINOUT = 'loginout';

const LoginModule = new EasyStore([
  {
    type: USER_LOGINOUT,
    url: { url: '/index/getUserInfo', http: Vue.http, method: 'get' },
    state: false,
    getter: false,
    mutation(state, data) {
      console.warn('USER_LOGINOUT:', data);
      state[USER_LOGIN] = null;
      Vue.storage.remove('user/login');
    }
  },

  {
    type: USER_LOGIN,
    increment: true,
    action(context, params, conf) {
      return this.dispatch(
        this.interceptor,
        {
          type: 'user/login',
          handler() {
            return Vue.http.post('/api/v2/user-system/login/login', params, conf)
                      .then(({ data }) => {
                        // 登录成功
                        if (data.data.token) {
                          return Promise.resolve(data.data);
                        }
                        // 登录失败
                        return Promise.reject(new Error(data['sub_msg'] || data.msg));
                      })
                      .catch(reason => Promise.reject(reason));
          },
          success(data) {
            console.warn('success:', data);
            context.commit(USER_LOGIN, data);
          },
          error(reason) {
            console.warn('error:', reason);
          }
        }
      );
    }
  }
]).output();

export default merge([
  LoginModule
]);
