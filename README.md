# @mudas/storage

> 这是一个同时支持 sessionStorage、localStorage、cookie、map 存储数据的工具库(This is a tool library that supports session Storage, local Storage, cookie, map to store data.)

**Note:** This library does not support the development of mini programs.

![image](https://raw.githubusercontent.com/aosnow/assets/master/img/storage.png)

## Setup
install:
```npm
npm i @mudas/storage
```

starting with v0.0.20, esm is supported. You need to add configuration for vue-cli to correctly translate the es module in node_modules:
```js
// vue.config.js:
module.exports = {
    transpileDependencies: [
      '@mudas/*' // all of node_module for '@mudas'
    ]
}
```

setup:
```js
import Storage from '@mudas/storage';
Vue.use(Storage);

new Vue({
  store: store,
  storage: new Storage.Store({ config: StorageConfig }),
  render: h => h(App)
}).$mount('#app');
```

For example, the following 'Action' need to be adapted to use automatic caching:
```js
// before
const Actions = {
  login(context, params) {
    return Vue.http.post('/api/v2/user-system/login/login', params)
              .then(({ data }) => {
                return Object.freeze(data);
              })
              .catch(reason => {
                console.warn(reason);
              });
  }
};
```
Reform：
```js
// after
const Actions = {
  login(context, params) {
    // 'this' points to store
    return this.dispatch(
      this.interceptor,
      {
        type: 'user/login',
        force: false, // default false, whether to force a new request for data
        handler() {
          return Vue.http.post('/api/v2/user-system/login/login', params)
                    .then(({ data }) => {
                      // please don't commit here, otherwise you can't automatically restore the cache to state.
                      return Promise.resolve(data);
                    })
                    .catch(reason => {
                      return Promise.reject(reason);
                    });
        },
        success(data) {
          // ...some commit, and acting on automatic restore to state
          context.commit('logInfo', data.data);
        },
        error(reason) {
          // capture errors to prevent dispatch to callers
          console.warn('error:', reason);
        }
      }
    );
  }
};
```


## Feature
Automatically complete the integration with Vuex.Store, contain the following feature:

- Configure the 'Action', that needs to be cached to cache to the specified type of storage as required
- Specify the expiration time of the cache
- Support for localStorage, sessionStorage, cookie, memory (map)
- Automated recovery caching in 'store.state'

## Usage
### new Storage.Store(options)

### options.unique：
- #### type: String
Unique code, if specified,`'key'`will become`'key@[unique]'`
Domain space cannot be distinguished when debugging locally. This parameter can solve the problem of data confusion when multiple websites are debugging at 127.0.0.1.

### options.state：
- #### type: Object
This parameter is used to override the default global cache configuration：
```
// default
{
  expire: 0,
  storage: StorageType.sessionStorage // default storage engine
}
```
- #### global state config
  - #### expire: Number
    the number of seconds that are timed out, 0 means never timed out.
  - #### storage: String
    storage engine(localStorage, session Storage, cookie, memory)

### options.config：
- #### type: Array
cache rule.

- #### example：
```js
[
  { type: 'user/login', storage: StorageType.localStorage, expire: 1800 }
]
```
- #### config item options
  - ##### type: String
    action path，e.g `user/login`
  - ##### storage: String
    storage engine(localStorage, session Storage, cookie, memory)
  - ##### expire: Number（unit/seconds）
    the number of seconds that are timed out, 0 means never timed out.
  - ##### restore: Boolean（`default: true`）
    whether application initialization automatically restores caching
  - ##### cookie: Object
    ```typescript
    // Define when the cookie will be removed. Value can be a Number which will be interpreted as days from time of creation or a Date instance. If omitted, the cookie becomes a session cookie.
    expires?:number | Date;

    // A String indicating the path where the cookie is visible.
    path?:string;

    // A String indicating a valid domain where the cookie should be visible. The cookie will also be visible to all subdomains.
    domain?:string;

    // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    secure?:boolean;
    ```

### Storage
```typescript
export declare interface StorageOptions {
  unique?:string,
  state?:StateOptions,
  config?:Array<ConfigOptions>
}

declare class Storage {
  constructor(options?:StorageOptions)

  config:StorageConfig;
  state:StorageState;

  /**
   * 检测是否过期（单位：秒）
   * @param {Number} timestamp 旧的时间戳
   * @param {Number} expire 过期时间
   * @returns {boolean}
   */
  static expired(timestamp:number, expire:number):boolean;

  /**
   * 针对当前应用设置唯一识别码（若不设置，则不启用“域规则”）
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {string} code 唯一码（长度必须大于5位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  setUnique(code:string):void;

  /**
   * 分析获取缓存数据
   * @param {String|Object} type
   * @return {*}
   */
  resolve(type:string | ConfigOptions):any;

  /**
   * 缓存数据到浏览器缓存
   * @param {String} type 注册标识名
   * @param {*} payload 需要被缓存的数据
   * @param {Boolean} [autoMerge=true] 是否合并到已经存在的缓存数据
   * @param {Object} [options=null] 额外存储参数，可以覆盖 config
   */
  cache(type:string, payload:any, options?:CacheMethodOptions, autoMerge?:boolean):void;

  /**
   * 移除指定 type 对应的缓存数据
   * @param type
   * @param {Object} [options=null] 额外存储参数，可以覆盖 config
   */
  remove(type:string, options?:CacheMethodOptions):void;

  /**
   * 将已经缓存的数据恢复到 state 中
   * @param type
   */
  restore(type:string):void;
}

/**
 * 配置参数
 */
export interface ConfigOptions {

  // type 必须是已经定义的 mutation 名，若使用了 Module，需要指定完整包含 Module 和 type 的值，如“info/save”
  type:string;

  // storage 存储引擎类型：localStorage,sessionStorage（默认）,memory,cookie。推荐通过 STORAGE_TYPE 进行引用取得
  storage:string;

  // expire 数据保持的时间，单位秒，过期后将重新请求新数据（默认：0，即不过期或随生命周期）
  expire?:number;

  // restore 控制在页面刷新重新进入应用时是否需要恢复缓存，若不在初始化时恢复缓存，则在主动发起第一次请求时才被恢复到 state。
  restore?:boolean | RestoreHandler;

  // 当存储引擎（StorageType.cookie）为 cookie 时的配置参数，其它类型引擎忽略此参数
  cookie?:{
    // cookie 过期时间，默认会话结束时删除。
    // 当为 number 类型值时，代表多少天过期；当为 Date 实例时代表指定时间过期
    expires?:number | Date;

    // 存储路径
    path?:string;

    // 存储域名
    domain?:string;

    // 是否使用 https 协议
    secure?:boolean;
  }
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

interface StateOptions {
  expire:number;
  storage:string
}

declare class StorageState {
  /**
   * 构建实例
   * @param {StateOptions} [options] 全局配置，可通过私有配置进行覆盖
   */
  constructor(options?:StateOptions);

  // --------------------------------------------------------------------------
  //
  // Class properties
  //
  // --------------------------------------------------------------------------

  // 默认配置
  static DefaultOptions:{
    expire:number, // 0-永久不超时，直到生命周期结束; 其它值以 秒 为单位判断超时
    storage:string // 默认缓存存储引擎
  };

  /**
   * 唯一识别码
   * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
   * @param {String} code 唯一码（长度必须大于等于6位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
   */
  unique:string;

  // --------------------------------------------------------------------------
  //
  // Class methods
  //
  // --------------------------------------------------------------------------

  /**
   * 设置状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {Object} state 需要存储的状态数据
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {Object} [options=null] 额外参数
   * @returns {*|void}
   */
  setState(key:string, state:any, storageType:string, options?:object):void;

  /**
   * 取出状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {Object} [value] 缺省值。前者无值时的替代方案
   * @param {Object} [options=null] 额外参数
   * @returns {*}
   */
  getState(key:string, storageType:string, options?:object, value?:any):any;

  /**
   * 移除指定状态缓存
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @param {String} [storageType] 存储引擎类型，若不设置默认以 sessionStorage 引擎
   * @param {Object} [options=null] 额外参数
   * @returns {void}
   */
  removeState(key:string, storageType:string, options?:object);

  /**
   * 经过处理后的 key
   * @param {String} key 唯一性的识别码（一般对应到后端接口名或者 mutation-type）
   * @returns {string}
   */
  genKey(key:string);
}

```
