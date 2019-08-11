// ------------------------------------------------------------------------------
// name: utils
// author: 喵大斯( mschool.tech )
// created: 2019/8/6 17:37
// ------------------------------------------------------------------------------

export function assert(condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`);
}
