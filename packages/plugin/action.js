// ------------------------------------------------------------------------------
// name: Action
// author: mudas( mschool.tech )
// created: 2019.08.05 上午 0:22
// ------------------------------------------------------------------------------

import { isFunction } from 'lodash-es';

// 用来完成持久缓存数据的“读取”
// 即在提交 http request 之前，检测是否有可用缓存
// 1、有缓存则放弃请求，使用本地缓存数据
// 2、无缓存或已过期，则删除缓存，并重新请求新的数据
export default function(context, { type, handler, success, error, force }) {

  const storage = this._storage;
  const registed = storage.config.has(type);
  const cacheData = storage.resolve(type);

  success = isFunction(success) ? success : () => null;

  return new Promise((resolve, reject) => {
    if (cacheData && !force) {
      success.call(this, cacheData.payload);
      resolve(cacheData.payload);
      console.warn('cachedata:', cacheData.payload);
    }
    else {
      handler().then(data => {
        console.warn('postdata:', data);

        // 根据是否注册写入缓存
        if (registed) storage.cache(type, data);

        // 返回给被代理 action 内部处理（比如 commit）
        // 保障 success 的目的在于能够自动恢复缓存数据到 state
        // 若无 success 定义，则相当于此代理 action 没有发挥作用（只是包装一层返回原始结果）
        success.call(this, data);

        // 返回给调用者（一般由ui层调用dispatch）
        resolve(data);

      }).catch(reason => {
        isFunction(error) && error.call(this, reason);

        // 返回给调用者（一般由ui层调用dispatch）
        reject(reason);
      });
    }
  });

}
