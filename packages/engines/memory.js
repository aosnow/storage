import STORAGE_TYPE from '../StorageType';

/**
 * map memory 存储引擎
 * <p>作为不支持 sessionstorage 的降级支持方案</p>
 */
export default {
  type: STORAGE_TYPE.memory,
  storage: new Map(),
  getItem(key) {
    return this.storage.get(key);
  },
  setItem(key, value) {
    this.storage.set(key, value);
  },
  removeItem(key) {
    this.storage.delete(key);
  },
  clear() {
    this.storage.clear();
  }
};
