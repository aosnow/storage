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
    return this.storage.get(key);
  },
  setItem(key, value, options = { path: '' }) {
    this.storage.set(key, value, options);
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
