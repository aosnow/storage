# @mudas/storage

> 这是一个同时支持 sessionStorage、localStorage、cook、map 存储数据的工具库  
This is a tool library that supports session Storage, local Storage, cookie, map to store data.

![image](https://raw.githubusercontent.com/aosnow/assets/master/img/storage.png)

## Setup
install:
```npm
npm i @mudas/storage core-js lodash-es -S
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
