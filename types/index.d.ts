// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/4
// ------------------------------------------------------------------------------

import Vue from 'vue';
import Storage from './Storage';
import StorageType from './StorageType';
import StorageConfig from './StorageConfig';
import StorageState from './StorageState';

export declare function install(Vue:Vue):void;

declare const Store = Storage;

export default {
  Store: Storage,
  StorageType,
  StorageConfig,
  StorageState
};

export {
  Storage as Store,
  StorageType,
  StorageConfig,
  StorageState
};
