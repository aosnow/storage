import Cookie from 'js-cookie';
import { isNil } from '@mudas/util';
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

  // 读取时，`js-cookie` 不支持 options 参数
  // 仅在相应的 path、domain 环境中，自适应读取相应 key 对应的 cookie 值
  // 对于相同域名下，优先读取当前目录对应的 cookie 值，然后逐级向上读取，直到根目录为止
  // 不同的二级域名之间共享 cookie 值
  getItem(key, options) {
    let value = this.storage.get(key, options);
    return isNil(value) ? null : JSON.parse(decodeURIComponent(value));
  },

  setItem(key, value, options = { path: '' }) {
    // 使用 encodeURIComponent 而非 escape，预防 value 中包含 URI 地址
    value = isNil(value) ? '' : encodeURIComponent(JSON.stringify(value));
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
