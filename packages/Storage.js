// ------------------------------------------------------------------------------
// name: Storage
// author: 喵大斯( mschool.tech )
// created: 2019/7/30 17:47
// ------------------------------------------------------------------------------

import { now } from 'lodash-es';
import StorageConfig from './StorageConfig';
import StorageState from './StorageState';

class Storage {

  // --------------------------------------------------------------------------
  //
  // Class constructor
  //
  // --------------------------------------------------------------------------
  constructor() {
    this._state = new StorageState();
    this._config = new StorageConfig();
  }

  // --------------------------------------------------------------------------
  //
  // Class properties
  //
  // --------------------------------------------------------------------------

  _state = null;
  _config = null;

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

  // ----------------------------------------
  // Vuex Action
  // ----------------------------------------

  get action() {
    return this._vuexAction(this._config, this._state);
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
   * 从指定字符串类型的 type 值中解析是否包含 module
   * @param {String} type 指定 Mutation 类型值
   * @returns {{module:String, type:String}}
   */
  static parseType(type) {
    const mt = type.split(/\//ig);
    const realType = mt.pop();
    const module = mt.length > 0 ? mt.join('/') : '';

    return { module, type: realType };
  }

  /**
   * 针对当前应用设置唯一识别码（若不设置，则不启用“域规则”）
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {string} code 唯一码（长度必须大于5位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  setUnique(code) {
    this._state.unique = code;
  }

  _vuexAction(config, state) {
    return ({ commit }, { type, getData, force }) => {
      return new Promise((resolve, reject) => {

        // { type, storage, expire }
        const conf = config.get(type);

        // 若未注册则提示错误中断程序执行
        if (!conf) {
          throw new Error('Unregistered persistent status configuration, please register with \'config.add()\' or \'config.batch()\'');
        }

        // 尝试取缓存数据
        let cacheData = state.getState(conf.type, conf.storage);

        // 由于 Action 挂载于 store 内部，因此在 dispatch/commit 等时刻，不需要再加模块前缀
        // 此处目的在于分解模块名和 type 名，进行后续内部操作
        const types = Storage.parseType(conf.type);

        // 检测数据缓存是否过期
        // 如果之前存放数据时设置了时间戳，且配置了过期时间，则检测过期逻辑
        if (cacheData && cacheData.timestamp &&
            typeof conf.expire === 'number' && conf.expire > 0 &&
            Storage.expired(cacheData.timestamp, conf.expire)) {
          // 移除缓存数据
          state.removeState(conf.type, conf.storage);

          // 清除临时数据，阻止使用缓存数据
          cacheData = null;
        }

        // conf.expire 为 0 或未设置值，缓存将永久性不过期
        if (cacheData && !force) {
          // console.warn('使用缓存数据进行 commit.', cacheData.payload);
          commit(types.type, cacheData.payload);
          resolve(cacheData.payload);
        }
        else {
          getData().then(data => {
            // console.warn('请求远程数据进行 commit.', data);
            commit(types.type, data);
            resolve(data);
          }).catch(error => {
            reject(error);
          });
        }
      });
    };

  }

}
