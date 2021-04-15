// ------------------------------------------------------------------------------
// name: actionWrapper
// author: 喵大斯( mschool.tech )
// created: 2019/8/6 22:10
// ------------------------------------------------------------------------------

import InterceptorAction from './action';

const ActionName = '__interceptorAction';

// /**
//  * 普通 action
//  * @param {String} namespace
//  * @param {String} name action 的名字
//  * @param {Function} action
//  */
// function wrappedActionHandler(namespace, name, action) {
//
//   return function(context, params) {
//     return context.dispatch(ActionName, {
//       type: `${namespace}${name}`,
//       handler: () => {
//         let res = action.call(this, context, params);
//         console.warn('success11:', res);
//
//         if (!isPromise(res)) {
//           res = Promise.resolve(res);
//         }
//
//         // 得到正确的数据写入到缓存
//         res.then(data => {
//           console.warn('success22:', data);
//         });
//
//         return res;
//       }
//     });
//   };
// }
//
// function wrapActions(path, rawModule) {
//
//   const namespace = this._modules.getNamespace(path);
//
//   // 根级无条件增加拦截
//   if (namespace.length === 0) {
//     embedAction(rawModule);
//   }
//
//   // 包装 actions
//   // persistent = false 取消持久化事务的注入（用户自行决定）
//   if (rawModule.actions && rawModule.persistent !== false) {
//     Object.keys(rawModule.actions)
//           .filter(key => key !== ActionName)
//           .forEach(key => {
//             const action = rawModule.actions[key];
//             rawModule.actions[key] = wrappedActionHandler.call(this, namespace, key, action);
//           });
//   }
//
//   // 子模块 root.modules.xxx.actions
//   if (rawModule.modules) {
//     Object.keys(rawModule.modules).forEach(key => {
//       const parentPath = path.slice();// 同级路径的起点应该都是 path，而不应该改变它让其它同级错误
//       parentPath.push(key); // 父级模块的分支路径
//       wrapActions.call(this, parentPath, rawModule.modules[key]);
//     });
//   }
// }

function embedAction(rawModule) {
  // store.interceptor
  this.interceptor = ActionName;
  rawModule.actions = rawModule.actions || {};
  rawModule.actions[ActionName] = InterceptorAction;
}

export { embedAction };
