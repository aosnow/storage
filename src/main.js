import Vue from 'vue';
import EasyHttp from '@mudas/http';
import Storage from '@mudas/storage';
// import { StorageSubscribe } from '@mudas/storage';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { interceptors, transformResponse } from './interceptor';
import StorageConfig from './storage/config';

import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(EasyHttp, { transformResponse });
Vue.use(Storage);

// 注册拦截器
Vue.http.batchUseInterceptor(interceptors);

new Vue({
  store: store,
  storage: new Storage.Store({ unique: 'XXXOOO', config: StorageConfig }),
  render: h => h(App)
}).$mount('#app');
