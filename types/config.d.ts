// ------------------------------------------------------------------------------
// name: config.d
// author: mudas( mschool.tech )
// created: 2021/4/15
// ------------------------------------------------------------------------------

import { Store } from 'vuex/types';

type RestoreHandler = (store: Store<any>, cacheData?: any, conf?: any) => void;

export declare interface CookieOptions extends CacheMethodOptions{
  // cookie 过期时间，默认会话结束时删除。
  // 当为 number 类型值时，代表多少天过期；当为 Date 实例时代表指定时间过期
  expires?: number | Date;

  // 存储路径
  path?: string;

  // 存储域名
  domain?: string;

  // 是否使用 https 协议
  secure?: boolean;
}

/**
 * 配置参数
 */
export interface ConfigOptions {

  // type 必须是已经定义的 mutation 名，若使用了 Module，需要指定完整包含 Module 和 type 的值，如“info/save”
  type: string;

  // storage 存储引擎类型：localStorage,sessionStorage（默认）,memory,cookie。推荐通过 STORAGE_TYPE 进行引用取得
  storage: 'localStorage' | 'sessionStorage' | 'memory' | 'cookie';

  // expire 数据保持的时间，单位秒，过期后将重新请求新数据（默认：0，即不过期或随生命周期）
  expire?: number;

  // restore 控制在页面刷新重新进入应用时是否需要恢复缓存，若不在初始化时恢复缓存，则在主动发起第一次请求时才被恢复到 state。
  restore?: boolean | RestoreHandler;

  // 各存储引擎（StorageType.cookie）对应的扩展配置参数
  option?: CookieOptions | CacheMethodOptions;
}

export declare interface CacheMethodOptions {
  // 是否使用 unique 对 key 进行唯一处理
  // 将直接影响 StorageState 存储缓存时的最终 key 名
  unique?: boolean;
}
