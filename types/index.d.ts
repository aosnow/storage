// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/4
// ------------------------------------------------------------------------------

import Vue from 'vue';
import { PluginObject, PluginFunction } from 'vue';
import { Store } from 'vuex';
import { EasyHttpInstance } from '@mudas/http/types/EasyHttp';
import Storage from './Storage';

declare module 'vue/types/vue' {
  interface Vue {
    $store:Store<any>;
  }

  interface VueConstructor<V extends Vue> {
    http:EasyHttpInstance;
  }
}

declare const _default:{
  /**
   * 做为 Vue 插件提供注册，绑定 EasyHttp 实例到 Vue.http
   * @param {Vue} Vue
   */
  install:PluginFunction<any>;

  Store:Storage;
  StorageType;
  StorageConfig;
  StorageState;
};

export default _default;
// interface Storage extends PluginObject<any> {
//   /**
//    * 做为 Vue 插件提供注册，绑定 EasyHttp 实例到 Vue.http
//    * @param {Vue} Vue
//    */
//   install:PluginFunction<any>;
// }
