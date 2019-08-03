// ------------------------------------------------------------------------------
// name: index
// author: 喵大斯( mschool.tech )
// created: 2019/8/4 1:18
// ------------------------------------------------------------------------------

import Token from './token';

// 所有需要注册的拦截器列表
const interceptors = [Token];

/**
 * 注册拦截器集合
 * @param {EasyHttp} easyHttp
 */
const register = function(easyHttp) {
  interceptors.forEach(item => {
    const { type, interceptor, error } = item;
    easyHttp.useInterceptor(type, interceptor, error);
  });
};

export default register;
