// ------------------------------------------------------------------------------
// name: config
// author: 喵大斯( mschool.tech )
// created: 2019/8/7 18:00
// ------------------------------------------------------------------------------

import { StorageType } from '@mudas/storage';

export default [
  { type: 'user/login', storage: StorageType.localStorage, expire: 1800 },
  { type: 'cover-test', storage: StorageType.cookie, expire: 1800, restore: false, cookie: { path: '/' } }
];
