// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/4
// ------------------------------------------------------------------------------

import _Vue from 'vue';
import Storage, { StorageOptions } from './Storage';
import StorageType from './StorageType';
import StorageConfig from './StorageConfig';
import StorageState from './StorageState';

// 扩展 Vue 静态属性，若是实例属性直接扩展 interface Vue 即可
declare module 'vue/types/vue' {
  interface VueConstructor {
    storage:Storage;
  }
}

export declare function install(Vue:typeof _Vue, options?:StorageOptions):void;

declare const _default:{
  install:typeof install,
  Store:typeof Storage,
  StorageType:typeof StorageType,
  StorageConfig:typeof StorageConfig,
  StorageState:typeof StorageState
};
export default _default;
export { Storage, StorageType, StorageConfig, StorageState };
