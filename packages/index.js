// ------------------------------------------------------------------------------
// name: index
// author: 喵大斯( mschool.tech )
// created: 2019/7/30 15:46
// ------------------------------------------------------------------------------

import { install, Storage } from './Storage';
import StorageType from './StorageType';
import StorageConfig from './StorageConfig';
import StorageState from './StorageState';

export default {
  install,
  Store: Storage,
  StorageType,
  StorageConfig,
  StorageState
};
export { Storage, StorageType, StorageConfig, StorageState };
