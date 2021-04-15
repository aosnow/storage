// ------------------------------------------------------------------------------
// name: StorageState.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/9
// ------------------------------------------------------------------------------

import { CacheMethodOptions } from './config';

export interface StateOptions {
  expire: number;
  storage: string
}

declare class StorageState {
  /**
   * 构建实例
   * @param {StateOptions} [options=null] 全局配置，可通过私有配置进行覆盖
   */
  constructor(options?: StateOptions);

  // --------------------------------------------------------------------------
  //
  // Class properties
  //
  // --------------------------------------------------------------------------

  // 默认配置
  static DefaultOptions: {
    expire: number, // 0-永久不超时，直到生命周期结束; 其它值以 秒为单位判断超时
    storage: string // 默认缓存存储引擎
  };

  /**
   * 唯一识别码
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {String} code 唯一码（长度必须大于等于6位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  unique: string;

  // --------------------------------------------------------------------------
  //
  // Class methods
  //
  // --------------------------------------------------------------------------

  /**
   * 设置状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {Object} state 需要存储的状态数据
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {CacheMethodOptions} [options=null] 额外参数
   * @returns {*|void}
   */
  setState(key: string, state: any, storageType: string, options?: CacheMethodOptions): void;

  /**
   * 取出状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {Object} [value] 缺省值。前者无值时的替代方案
   * @param {CacheMethodOptions} [options=null] 额外参数
   * @returns {*}
   */
  getState(key: string, storageType: string, options?: CacheMethodOptions, value?: any): any;

  /**
   * 移除指定状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {CacheMethodOptions} [options=null] 额外参数
   * @returns {void}
   */
  removeState(key: string, storageType: string, options?: CacheMethodOptions);

  /**
   * 经过处理后的 key
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @returns {string}
   */
  genKey(key: string);
}

export default StorageState;
