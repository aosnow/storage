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
  getItem(key) {
    let value = this.storage.get(key);
    value = !value ? null : JSON.parse(unescape(value));
    return value;
  },
  setItem(key, value, options = { path: '' }) {
    value = value !== undefined ? JSON.stringify(value) : '';
    this.storage.set(key, escape(value), options);
  },
  removeItem(key) {
    this.storage.remove(key);
  },
  clear() {
    const cookies = this.storage.get();
    Object.keys(cookies).forEach(key => {
      this.storage.remove(key);
    });
  }
};
