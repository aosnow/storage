// ------------------------------------------------------------------------------
// name: StorageConfig.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/9
// ------------------------------------------------------------------------------

export interface ConfigOptions {
  // type 必须是已经定义的 mutation 名，若使用了 Module，需要指定完整包含 Module 和 type 的值，如“info/save”
  // storage 存储引擎类型：localStorage,sessionStorage（默认）,memory,cookie。推荐通过 STORAGE_TYPE 进行引用取得
  // expire 数据保持的时间，单位秒，过期后将重新请求新数据（默认：0，即不过期或随生命周期）
  // restore 控制在页面刷新重新进入应用时是否需要恢复缓存，若不在初始化时恢复缓存，则在主动发起第一次请求时才被恢复到 state。
  type:string;
  storage:string;
  expire?:number;
  restore?:boolean;
}

declare class StorageConfig {
  constructor();

  /**
   * 检测指定的配置是否需要在刷新时恢复缓存
   * <p>conf.restore 控制在页面刷新重新进入应用时是否需要恢复缓存，若不在初始化时恢复缓存，则在主动发起第一次请求时才被恢复到 state。</p>
   * @param conf
   * @return {boolean}
   */
  static needRestore(conf:object):boolean;

  /**
   * 注册需要进行持久化存储的 type 配置
   * @param {Object} options 缓存规则配置
   */
  add(options:ConfigOptions):void;

  /**
   * 获取指定的 type 对应配置信息
   * @param {String} type
   * @returns {ConfigOptions}
   */
  get(type:string):ConfigOptions;

  /**
   * 通过 add() 方法进行批量注册
   * @param {Array<ConfigOptions>} confs 配置集合
   */
  batch(confs:Array<ConfigOptions>):void;

  /**
   * 检测指定的 type 是否已经注册
   * @param {String} type
   * @returns {Boolean}
   */
  has(type:string):boolean;

  /**
   * 移除已经注册的 type
   * <p>移除后，将直接使用请求取数据，从而忽略缓存</p>
   * @param type
   */
  remove(type:string):void;

  /**
   * 遍历所有配置表
   * @param {Function} func
   */
  forEach(func:(config:ConfigOptions, type?:string) => {}):void;
}

export default StorageConfig;
