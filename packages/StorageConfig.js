// ------------------------------------------------------------------------------
// name: StorageConfig
// author: 喵大斯( mschool.tech )
// created: 2019/7/30 15:47
// ------------------------------------------------------------------------------

import STORAGE_TYPE from './StorageType';

class StorageConfig {

  // 配置表
  _map;

  constructor() {
    this._map = Object.create(null);
  }

  /**
   * 注册需要进行持久化存储的 type 配置
   * @param {String} type 必须是已经定义的 mutation 名，若使用了 Module，需要指定完整包含 Module 和 type 的值，如“info/save”
   * @param {String} [storage] 存储引擎类型：localStorage,sessionStorage（默认）,memory,cookie。推荐通过 STORAGE_TYPE 进行引用取得
   * @param {Number} [expire] 数据保持的时间，单位秒，过期后将重新请求新数据（默认：0，即不过期或随生命周期）
   */
  add({ type, storage = STORAGE_TYPE.sessionStorage, expire = 0 }) {
    if (typeof type !== 'string' || typeof expire !== 'number' || !STORAGE_TYPE.valid(storage)) {
      throw new Error('Invalid persistent state configuration');
    }
    this._map[type] = { type, storage, expire };
  }

  /**
   * 获取指定的 type 对应配置信息
   * @param {String} type
   * @returns {{type:String, storage:String, expire:Number}}
   */
  get(type) {
    return this._map[type];
  }

  /**
   * 通过 add() 方法进行批量注册
   * @param {Array<{ type, storage?, expire? }>} confs 配置集合
   */
  batch(confs) {
    if (Array.isArray(confs)) {
      confs.forEach(conf => {
        this.add(conf);
      });
    }
  }

  /**
   * 检测指定的 type 是否已经注册
   * @param {String} type
   * @returns {Boolean}
   */
  has(type) {
    return this._map[type] !== undefined;
  }

  /**
   * 移除已经注册的 type
   * <p>移除后，将直接使用请求取数据，从而忽略缓存</p>
   * @param type
   */
  remove(type) {
    if (this.has(type)) {
      delete this._map[type];
    }
  }

  /**
   * 遍历所有配置表
   * @param {Function} func
   */
  forEach(func) {
    Object.keys(this._map).forEach(key => {
      func.call(this, this._map[key], key);
    });
  }
}

export default StorageConfig;
