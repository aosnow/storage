import STORAGE_TYPE from '../StorageType';

/**
 * localStorage 存储引擎
 */
export default {
  type: STORAGE_TYPE.localStorage,
  storage: localStorage || window.localStorage,
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
