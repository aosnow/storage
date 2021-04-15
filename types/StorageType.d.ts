// ------------------------------------------------------------------------------
// name: StorageType.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/9
// ------------------------------------------------------------------------------

declare const StorageType: {
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage',
  memory: 'memory',
  cookie: 'cookie',

  /**
   * 检测指定类型标识是否合法
   * @param {String} type
   * @return {boolean}
   */
  valid(type: string): boolean;
};

export default StorageType;
