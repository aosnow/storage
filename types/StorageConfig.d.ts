// ------------------------------------------------------------------------------
// name: StorageConfig.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/9
// ------------------------------------------------------------------------------

import { ConfigOptions } from './config';

declare class StorageConfig {
  constructor();

  /**
   * 检测指定的配置是否需要在刷新时恢复缓存
   * <p>conf.restore 控制在页面刷新重新进入应用时是否需要恢复缓存，若不在初始化时恢复缓存，则在主动发起第一次请求时才被恢复到 state。</p>
   * @param conf
   * @return {boolean}
   */
  static needRestore(conf: object): boolean;

  /**
   * 注册需要进行持久化存储的 type 配置
   * @param {ConfigOptions} options 缓存规则配置
   */
  add(options: ConfigOptions): void;

  /**
   * 获取指定的 type 对应配置信息
   * @param {String} type
   * @returns {ConfigOptions}
   */
  get(type: string): ConfigOptions;

  /**
   * 通过 add() 方法进行批量注册
   * @param {Array<ConfigOptions>} confs 配置集合
   */
  batch(confs: Array<ConfigOptions>): void;

  /**
   * 检测指定的 type 是否已经注册
   * @param {String} type
   * @returns {Boolean}
   */
  has(type: string): boolean;

  /**
   * 移除已经注册的 type
   * <p>移除后，将直接使用请求取数据，从而忽略缓存</p>
   * @param {String} type
   */
  remove(type: string): void;

  /**
   * 遍历所有配置表
   * @param {Function} func
   */
  forEach(func: (config: ConfigOptions, type?: string) => {}): void;
}

export default StorageConfig;
