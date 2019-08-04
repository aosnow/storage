import Vue from 'vue';
import { EasyHttpPlugin } from '@mudas/http';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { interceptors, transformResponse } from './interceptor';

import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(EasyHttpPlugin, { transformResponse });

// 注册拦截器
Vue.http.batchUseInterceptor(interceptors);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
