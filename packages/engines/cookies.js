import Cookie from 'js-cookie';
import STORAGE_TYPE from '../StorageType';

/**
 * cookie 存储引擎
 */
export default {
  type: STORAGE_TYPE.cookie,

  /**
   * @type {Cookie}
   */
  storage: Cookie,

  // 读取时，options 无效，仅在相应的 path、domain 环境中读取相应的 key 对应的 cookie 值
  getItem(key, options) {
    let value = this.storage.get(key, options);
    value = !value ? null : value;
    return value;
  },
  setItem(key, value, options = { path: '' }) {
    // value = value !== undefined ? JSON.stringify(value) : '';
    // this.storage.set(key, escape(value), options);
    value = value !== undefined ? value : '';
    this.storage.set(key, value, options);
  },
  removeItem(key, options) {
    this.storage.remove(key, options);
  },
  clear() {
    const cookies = this.storage.get();
    Object.keys(cookies).forEach(key => {
      this.storage.remove(key);
    });
  }
};
