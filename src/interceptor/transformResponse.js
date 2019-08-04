// ------------------------------------------------------------------------------
// name: transformResponse
// author: mudas( mschool.tech )
// created: 2019.08.05 上午 2:31
// ------------------------------------------------------------------------------

import ServiceError from '@/error/ServiceError';

export default [

  // 拦截 response，处理业务逻辑错误
  function(data) {
    console.log('transformResponse:', data);

    const { code, msg, sub_msg } = data;
    if (code.toString() !== '10000') {
      // 转发给 reponse.error 进行处理
      throw new ServiceError(sub_msg || msg, code);
    }

    // 转发给 reponse.interceptor 进行处理
    return data;
  }
];
