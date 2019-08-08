// ------------------------------------------------------------------------------
// name: Storage.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/8
// ------------------------------------------------------------------------------

declare class Storage {
  constructor(options:{ unique?:string, state, config })

  config;
  state;

  /**
   * 检测是否过期（单位：秒）
   * @param {Number} timestamp 旧的时间戳
   * @param {Number} expire 过期时间
   * @returns {boolean}
   */
  static expired(timestamp:number, expire:number):boolean;

  /**
   * 从指定字符串类型的 type 值中解析是否包含 module
   * @param {String} type 指定 Mutation 类型值
   * @returns {{module:String, type:String}}
   */
  static parseType(type:string):{ module:String, type:String };

  /**
   * 针对当前应用设置唯一识别码（若不设置，则不启用“域规则”）
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {string} code 唯一码（长度必须大于5位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  setUnique(code:string):void;

  /**
   * 移除指定 type 对应的缓存数据
   * @param type
   */
  remove(type:string);

  /**
   * 将已经缓存的数据恢复到 state 中
   * @param type
   */
  restore(type:string);
}

export default Storage;
