// ------------------------------------------------------------------------------
// name: response
// author: mudas( mschool.tech )
// created: 2019.08.05 上午 1:53
// ------------------------------------------------------------------------------

import { HttpError } from '@mudas/http';
import ServiceError from '@/error/ServiceError';

// 以登录 service.login() 为例
// 1、vm 调用 service.login() 发出 request
// 2、service.login() 发生请求错误（网络错误、服务器返回错误）
// 3、通过 transformResponse 处理 “服务器返回错误”，抛出 throw Error()
//    通过 error() 处理 “网络错误”，抛出 throw Error()
// 4、以上两种错误，都会返回给 service.login() 的 catch() 分支进行捕获
// 5、将错误派发给 vm（后续采用集中订阅式中心化错误处理机制）

// 所有网络请求错误，都将在此拦截器被首先捕捉到，可以考虑统一输出相同格式的 Error 结构
export default {
  type: 'response',

  interceptor: response => {
    // 只处理数据逻辑，此处默认都是正确数据（因为此处实际已进入 then 进程，要想在 then 前拦截需要使用 transformResponse）
    const { data } = response;

    return response;
  },

  error: error => {
    // 网络错误、取消请求、请求超时等
    // 服务器返回的业务错误不做二次转换处理
    if (error instanceof ServiceError) {
      throw error;
    }
    else {
      const errInfo = HttpError.info(error);
      throw new Error(errInfo);
    }
  }
};
