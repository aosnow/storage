// ------------------------------------------------------------------------------
// name: mixin
// author: 喵大斯( mschool.tech )
// created: 2019/8/6 20:11
// ------------------------------------------------------------------------------

import cloneDeep from 'lodash.clonedeep';
import { embedAction } from './plugin/wrapper';

let _Vue;

/**
 * Vuex init hook, injected into each instances init hooks list.
 */
function storageInit() {
  const options = this.$options;
  const { store, storage } = options;

  // 首次创建根级 Vue 实例时会捕获到 options 配置选项
  if (store && storage) {
    // Vue.storage
    _Vue.storage = storage;

    // 实例缓存到 store，便于 interceptorAction 内部调用
    store._storage = storage;

    // 植入 interceptorAction
    const rawModule = cloneDeep(store._modules.root._rawModule);
    embedAction.call(store, rawModule);
    store.hotUpdate(rawModule);

    // 主动尝试恢复缓存数据到 store
    storage.restore(store);
  }
}

export default function(Vue) {
  _Vue = Vue;
  Vue.mixin({ beforeCreate: storageInit });
}
