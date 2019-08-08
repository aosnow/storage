# @mudas/storage

> 这是一个同时支持 sessionStorage、localStorage、cook、map 存储数据的工具库  
This is a tool library that supports session Storage, local Storage, cookie, map to store data.

![image](https://github.com/aosnow/assets/blob/master/img/storage.png)

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
- #### expire: Number
  the number of seconds that are timed out, 0 means never timed out.
- #### storage: String
  storage engine(localStorage, session Storage, cookie, memory)

### options.config：
- #### type: Array
global config setter.

- #### example：
```js
[
  { type: 'user/login', storage: StorageType.localStorage, expire: 1800 }
]
```
- #### config item options
  - ##### type: String（action path，e.g `user/login`）
  - ##### storage: String
  - ##### expire: Number（unit/seconds）
