// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/4
// ------------------------------------------------------------------------------

import Vue from 'vue';
import { PluginFunction } from 'vue';
import Storage from './Storage';
import StorageType from './StorageType';
import StorageConfig from './StorageConfig';
import StorageState from './StorageState';

export declare function install(Vue:Vue):void;

declare const _default:{
  /**
   * 做为 Vue 插件提供注册，绑定 EasyHttp 实例到 Vue.http
   * @param {Vue} Vue
   */
  install:PluginFunction<any>;

  Store:typeof Storage;
  StorageType:typeof StorageType;
  StorageConfig:typeof StorageConfig;
  StorageState:typeof StorageState;
};

export default _default;
