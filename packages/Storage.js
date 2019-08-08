// ------------------------------------------------------------------------------
// name: Storage
// author: 喵大斯( mschool.tech )
// created: 2019/7/30 17:47
// ------------------------------------------------------------------------------

import { now } from 'lodash-es';
import { assert } from './utils';
import StorageConfig from './StorageConfig';
import StorageState from './StorageState';
import InitMixin from './mixin';

export let Vue; // bind on install

export function install(_Vue) {
  if (Vue && _Vue === Vue) return;
  Vue = _Vue;
  InitMixin(Vue);
}

export class Storage {

  // --------------------------------------------------------------------------
  //
  // Class constructor
  //
  // --------------------------------------------------------------------------
  constructor({ unique = '', state = null, config = null }) {
    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Storage) before creating a store instance.`);
      assert(typeof Promise !== 'undefined', `storage requires a Promise polyfill in this browser.`);
      assert(this instanceof Storage, `store must be called with the new operator.`);
    }

    this._state = new StorageState(state);
    this._config = new StorageConfig();
    this._state.unique = unique;
    this._config.batch(config);
  }

  // --------------------------------------------------------------------------
  //
  // Class properties
  //
  // --------------------------------------------------------------------------

  /**
   * 数据存取管理对象
   * @type {StorageState}
   * @private
   */
  _state;

  /**
   * 配置对象
   * @type {StorageConfig}
   * @private
   */
  _config;

  // ----------------------------------------
  // config
  // ----------------------------------------
  get config() {
    return this._config;
  }

  // ----------------------------------------
  // state
  // ----------------------------------------
  get state() {
    return this._state;
  }

  // --------------------------------------------------------------------------
  //
  // Class methods
  //
  // --------------------------------------------------------------------------

  /**
   * 检测是否过期（单位：秒）
   * @param {Number} timestamp 旧的时间戳
   * @param {Number} expire 过期时间
   * @returns {boolean}
   */
  static expired(timestamp, expire) {
    const curTimestamp = now() * 0.001;// 转换成秒
    return curTimestamp - timestamp > expire;
  }

  /**
   * 针对当前应用设置唯一识别码（若不设置，则不启用“域规则”）
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {string} code 唯一码（长度必须大于5位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  setUnique(code) {
    this._state.unique = code;
  }

  /**
   * 分析获取缓存数据
   * @param {String|Object} type
   * @return {*}
   */
  resolve(type) {
    const conf = typeof type === 'string' ? this.config.get(type) : type;

    // 尝试取缓存数据
    let cacheData = this.state.getState(conf.type, conf.storage);

    // 检测数据缓存是否过期
    // 如果之前存放数据时设置了时间戳，且配置了过期时间，则检测过期逻辑
    if (cacheData && cacheData.timestamp &&
        typeof conf.expire === 'number' && conf.expire > 0 &&
        Storage.expired(cacheData.timestamp, conf.expire)) {

      // 移除缓存数据
      this.state.removeState(conf.type, conf.storage);

      // 清除临时数据，阻止使用缓存数据
      cacheData = null;
    }

    return cacheData;
  }

  /**
   * 缓存数据到浏览器缓存
   * @param {String} type 注册标识名
   * @param {*} payload 需要被缓存的数据
   */
  cache(type, payload) {
    const conf = this.config.get(type);
    this.state.setState(conf.type, { payload, timestamp: now() * 0.001 }, conf.storage);
  }

  /**
   * 移除指定 type 对应的缓存数据
   * @param type
   */
  remove(type) {
    const conf = this.config.get(type);
    this.state.removeState(conf.type, conf.storage);
  }

  /**
   * 将已经缓存的数据恢复到 state 中
   * @param {vuex.Store} store
   */
  restore(store) {
    this.config.forEach((conf, key) => {
      // 只对已经存在缓存数据的配置进行
      const cacheData = this.resolve(conf);

      if (cacheData) {
        // 当存在缓存数据时，无需传入任何参数，指向用户 action 进行缓存 commit 到 state
        store.dispatch(key);
      }
    });
  }

}

export default Storage;
