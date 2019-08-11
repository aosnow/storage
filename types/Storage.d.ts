// ------------------------------------------------------------------------------
// name: Storage.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/8
// ------------------------------------------------------------------------------

import StorageConfig, { ConfigOptions } from './StorageConfig';
import StorageState, { StateOptions } from './StorageState';

declare class Storage {
  constructor(options:{ unique?:string, state?:StateOptions, config?:ConfigOptions })

  config:StorageConfig;
  state:StorageState;

  /**
   * 检测是否过期（单位：秒）
   * @param {Number} timestamp 旧的时间戳
   * @param {Number} expire 过期时间
   * @returns {boolean}
   */
  static expired(timestamp:number, expire:number):boolean;

  /**
   * 针对当前应用设置唯一识别码（若不设置，则不启用“域规则”）
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {string} code 唯一码（长度必须大于5位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  setUnique(code:string):void;

  /**
   * 分析获取缓存数据
   * @param {String|Object} type
   * @return {*}
   */
  resolve(type:string | ConfigOptions):any;

  /**
   * 缓存数据到浏览器缓存
   * @param {String} type 注册标识名
   * @param {*} payload 需要被缓存的数据
   */
  cache(type:string, payload:any):void;

  /**
   * 移除指定 type 对应的缓存数据
   * @param type
   */
  remove(type:string):void;

  /**
   * 将已经缓存的数据恢复到 state 中
   * @param type
   */
  restore(type:string):void;
}

export default Storage;
