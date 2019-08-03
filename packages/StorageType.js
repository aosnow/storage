/**
 * 存储引擎的类型
 */
const STORAGE_TYPE = {
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage',
  memory: 'memory',
  cookie: 'cookie',

  /**
   * 检测指定类型标识是否合法
   * @param {String} type
   * @return {boolean}
   */
  valid(type) {
    return ['localStorage', 'sessionStorage', 'memory', 'cookie'].indexOf(type) !== -1;
  }
};

export default STORAGE_TYPE;
