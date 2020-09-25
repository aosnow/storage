// ------------------------------------------------------------------------------
// name: PersistedState
// author: 喵大斯( mschool.tech )
// created: 2019/7/30 17:57
// ------------------------------------------------------------------------------

import { merge } from 'lodash-es';
import StorageType from './StorageType';
import LocalStorage from './engines/local';
import SessionStorage from './engines/session';
import MemoryStorage from './engines/memory';
import CookieStorage from './engines/cookies';

class StorageState {

  /**
   * 构建实例
   * @param {{expire:Number, storage:String}|null} [options] 全局配置，可通过私有配置进行覆盖
   */
  constructor(options = null) {
    this._options = merge(StorageState.DefaultOptions, options);
  }

  // --------------------------------------------------------------------------
  //
  // Class properties
  //
  // --------------------------------------------------------------------------

  // 默认配置
  static DefaultOptions = {
    expire: 0, // 0-永久不超时，直到生命周期结束; 其它值以 秒 为单位判断超时
    storage: StorageType.sessionStorage // 默认缓存存储引擎
  };

  // ----------------------------------------
  // options
  // ----------------------------------------

  /**
   * 配置信息
   * @type {{expire:Number, storage:String}|null}
   * @private
   */
  _options;

  // ----------------------------------------
  // unique
  // ----------------------------------------

  // 标识当前存储目标做用域的唯一键值
  _unique;

  /**
   * 唯一识别码
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {String} code 唯一码（长度必须大于等于6位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  set unique(code) {
    if (!code || code.toLowerCase() === 'root') {
      // 都指定到 root 顶级作用域，所有应用共用
      code = null;
    }
    else {
      if (typeof code === 'string') {
        // 指定到特殊的“应用级局部作用域”

        // 不能包含空白字符
        if (/\s+/.test(code)) {
          throw new Error('no blank characters can be included');
        }

        // 不能小于6位
        if (code.length < 6) {
          throw new Error('the length is too small');
        }

        // 若只有字母、数字也警告
        if (/^([a-z]+|[0-9]+)$/i.test(code)) {
          console.warn(`unique code[${code}] is too simple, should contain letters, numbers and special symbols.`);
        }
      }
    }

    this._unique = code;
  }

  get unique() {
    return this._unique;
  }

  // --------------------------------------------------------------------------
  //
  // Class methods
  //
  // --------------------------------------------------------------------------

  /**
   * 检测获取最终可用的 storage 引擎
   * @param {String} [storageType] 存储引擎类型
   * @returns {{type, storage, getItem, setItem, removeItem, clear}}
   */
  _storage(storageType) {
    storageType = storageType || this._options.storage || StorageType.memory;
    switch (storageType) {
      case StorageType.localStorage:
        return LocalStorage;
      case StorageType.sessionStorage:
        return SessionStorage;
      case StorageType.cookie:
        return CookieStorage;
      default:
        return MemoryStorage;
    }
  }

  /**
   * 设置状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {Object} state 需要存储的状态数据
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {Object} [options=null] 额外参数
   * @returns {*|void}
   */
  setState(key, state, storageType = StorageType.sessionStorage, options = null) {
    const s = this._storage(storageType);
    const k = this.genKey(key);
    return s.setItem(k, state, options);
  }

  /**
   * 取出状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {Object} [value] 缺省值。前者无值时的替代方案
   * @param {Object} [options=null] 额外参数
   * @returns {*}
   */
  getState(key, storageType, options = null, value = null) {
    const s = this._storage(storageType);
    const k = this.genKey(key);
    const r = s.getItem(k, options);
    return r ? r : value;
  }

  /**
   * 移除指定状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {Object} [options=null] 额外参数
   * @returns {void}
   */
  removeState(key, storageType, options = null) {
    const s = this._storage(storageType);
    const k = this.genKey(key);
    s.removeItem(k, options);
  }

  /**
   * 经过处理后的 key
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @returns {string}
   */
  genKey(key) {
    // 若未设置 unique，则不使用“域规则”
    const uniqueKey = `[${this.unique || 'root'}]`;
    return this.unique ? `${key}@${uniqueKey}` : key;
  }

}

export default StorageState;
