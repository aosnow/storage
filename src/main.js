import Vue from 'vue';
import { EasyHttpPlugin } from '@mudas/http';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import interceptorRegister from './interceptor';

import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(EasyHttpPlugin);

// 注册拦截器
interceptorRegister(Vue.http);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
