// ------------------------------------------------------------------------------
// name: token
// author: 喵大斯( mschool.tech )
// created: 2019/8/4 1:13
// ------------------------------------------------------------------------------

import { hash } from '@mudas/http';

export default {
  type: 'request',
  interceptor: config => {
    config.headers.token = '';
    config.headers.invoke_source = '2101';
    config.headers.out_request_no = hash();
    return config;
  }
};
