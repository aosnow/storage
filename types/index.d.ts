// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/4
// ------------------------------------------------------------------------------

import Vue from 'vue';
import { EasyHttpInstance } from '@mudas/http/types/EasyHttp';

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue> {
    http:EasyHttpInstance;
  }
}
