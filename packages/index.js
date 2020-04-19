// ------------------------------------------------------------------------------
// name: index
// author: 喵大斯( mschool.tech )
// created: 2019/7/30 15:46
// ------------------------------------------------------------------------------

import { install, Storage } from './Storage';
import StorageType from './StorageType';
import StorageConfig from './StorageConfig';
import StorageState from './StorageState';

const _default = {
  install,
  Store: Storage
};

export default _default;
export { Storage as Store, StorageType, StorageConfig, StorageState };
