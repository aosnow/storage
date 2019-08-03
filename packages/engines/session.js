import STORAGE_TYPE from '../StorageType';

/**
 * sessionStorage 存储引擎
 */
export default {
  type: STORAGE_TYPE.sessionStorage,
  storage: sessionStorage || window.sessionStorage,
  getItem(key) {
    let r = this.storage.getItem(key);
    r = r ? JSON.parse(r) : r;
    return r;
  },
  setItem(key, value) {
    value = JSON.stringify(value);
    this.storage.setItem(key, value);
  },
  removeItem(key) {
    this.storage.removeItem(key);
  },
  clear() {
    this.storage.clear();
  }
};
