// ------------------------------------------------------------------------------
// name: actionWrapper
// author: 喵大斯( mschool.tech )
// created: 2019/8/6 22:10
// ------------------------------------------------------------------------------

import InterceptorAction from './action';

const ActionName = '__interceptorAction';

function embedAction(rawModule) {
  // store.interceptor
  this.interceptor = ActionName;
  rawModule.actions = rawModule.actions || {};
  rawModule.actions[ActionName] = InterceptorAction;
}

export { embedAction };
