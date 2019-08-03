import PersistedState from './PersistedState';
import STORAGE_TYPE from './storageType';

// 持久化缓存处理器实例
const $persistedState = new PersistedState();

/**
 * 针对当前应用设置唯一识别码
 * <p>针对不同的应用起到“作用域”的作用，以避免应用与应用之间的数据混乱问题</p>
 * @param {string} code 唯一码（长度必须大于5位，且不能是全字母或全数字），如“F@K%$JD&LF”，或者应用的网站域名“abc.com”
 */
function setUnique(code) {
  $persistedState.unique = code;
}

/**
 * 只有注册的 key 才会进行缓存
 */
const PersistedConfig = {
  /**
   * 注册需要进行持久化存储的 MutationType 配置
   * @param {String} type 必须是已经定义的 mutation 名，若使用了 Module，需要指定完整包含 Module 和 type 的值，如“info/save”
   * @param {String} [storage] 存储引擎类型：localStorage,sessionStorage,memory。推荐通过 STORAGE_TYPE 进行引用取得
   * @param {Number} [expire] 数据保持的时间，单位秒，过期后将重新请求新数据（只对 LocalStorage 支持，目前尚未开发）
   */
  add({ type, storage, expire }) {
    if (!type) throw new Error('Invalid persistent state configuration');
    this[type] = { type, storage, expire: expire || 0 };
  },

  /**
   * 通过 add() 方法进行批量注册
   * @param {Array<{ type, storage?, expire? }>} confs 配置集合
   */
  batch(confs) {
    if (Array.isArray(confs)) {
      confs.forEach(conf => {
        this.add(conf);
      });
    }
  },

  /**
   * 检测指定的 MutationType 是否已经注册
   * @param mutationType
   * @returns {Boolean}
   */
  has(mutationType) {
    return this[mutationType];
  },
  /**
   * 移除已经注册的 MutationType
   * <p>移除后，将直接使用请求取数据，从而忽略缓存</p>
   * @param mutationType
   */
  remove(mutationType) {
    if (this.has(mutationType)) {
      delete this[mutationType];
    }
  }
};

/**
 * 检测是否过期（单位：秒）
 * @param {Number} timestamp 旧的时间戳
 * @param {Number} expire 过期时间
 * @returns {boolean}
 */
const expired = (timestamp, expire) => {
  const curTimestamp = new Date().getTime() * 0.001;// 转换成秒
  return curTimestamp - timestamp > expire;
};

/**
 * 从指定字符串类型的 type 值中解析是否包含 module
 * @param {String} type 指定 Mutation 类型值
 * @returns {{module:String, type:String}}
 */
const parseType = type => {
  const mt = type.split(/\//ig);
  const realType = mt.pop();
  const module = mt.length > 0 ? mt.join('/') : '';

  return { module, type: realType };
};

/**
 * 统一拦截和处理 Action 的数据请求，决定是使用缓存还是直接请求
 * @param commit
 * @param {String} type 指定 Mutation 的名字
 * @param {Function<Promise>} getData 执行请求数据的 Promise 包装函数
 * @param {Boolean} force 是否强制重新请求，以便于重写新的数据
 * @returns {Promise}
 */
const PersistedAction = ({ commit }, { type, getData, force }) =>
  new Promise((resolve, reject) => {
    const conf = PersistedConfig[type];

    // 若未注册则提示错误中断程序执行
    if (!conf) {
      throw new Error('Unregistered persistent status configuration, please register with \'PersistedConfig.add()\' or \'PersistedConfig.batch()\'');
    }

    // 尝试取缓存数据
    let cacheData = $persistedState.getState(conf.type, conf.storage);

    // 由于 PersistedAction 挂载于 store 内部，因此在 dispatch/commit 等时刻，不需要再加 模块前缀
    // 此处目的在于分解模块名和 type 名，进行后续内部操作
    const types = parseType(conf.type);

    // 检测数据缓存是否过期
    // 如果之前存放数据时设置了时间戳，且配置了过期时间，则检测过期逻辑
    if (cacheData && cacheData.timestamp &&
        typeof conf.expire === 'number' && conf.expire > 0 &&
        expired(cacheData.timestamp, conf.expire)) {
      // 移除缓存数据
      $persistedState.removeState(conf.type, conf.storage);

      // 清除临时数据，阻止使用缓存数据
      cacheData = null;
    }

    // conf.expire 为 0 或未设置值，缓存将永久性不过期

    if (cacheData && !force) {
      // console.warn('使用缓存数据进行 commit.', cacheData.payload);
      commit(types.type, cacheData.payload);
      resolve(cacheData.payload);
    }
    else {
      getData().then(data => {
        // console.warn('请求远程数据进行 commit.', data);
        commit(types.type, data);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    }
  });

/**
 * Vuex 持久化插件
 * @param store
 * @constructor
 */
const PersistedPlugin = store => {
  // 存数据
  store.subscribe(({ type, payload }) => {
    const conf = PersistedConfig[type];

    if (conf && conf.type) {
      // $persistedState.setState(conf.type, payload, conf.storage, conf.expire);
      $persistedState.setState(
        conf.type,
        { payload, timestamp: new Date().getTime() * 0.001 },
        conf.storage
      );
    }
  });
};

/**
 * 持久化数据清除器
 */
const PersistedClear = {
  remove(type) {
    const conf = PersistedConfig[type];
    $persistedState.removeState(conf.type, conf.storage);
  }
};

/**
 * 主动恢复持久化数据到 vuex
 * <p>前提：必须先定义 vuex，且使用 PersistedConfig 进行注册缓存的 mutation 配置。</p>
 */
const PersistedRestore = {
  restore(store, type) {
    const conf = PersistedConfig[type];

    // 尝试取缓存数据
    let cacheData = $persistedState.getState(conf.type, conf.storage);

    // 检测数据缓存是否过期
    // 如果之前存放数据时设置了时间戳，且配置了过期时间，则检测过期逻辑
    if (cacheData && cacheData.timestamp &&
        typeof conf.expire === 'number' && conf.expire > 0 &&
        expired(cacheData.timestamp, conf.expire)) {
      $persistedState.removeState(conf.type, conf.storage);
      cacheData = null;
    }

    if (cacheData) {
      console.warn('使用缓存数据进行主动恢复 commit.', cacheData.payload);
      store.commit(conf.type, cacheData.payload);
    }
  }
};

export {
  PersistedState,
  setUnique,
  PersistedClear,
  PersistedRestore,
  PersistedAction,
  PersistedPlugin,
  PersistedConfig,
  STORAGE_TYPE
};
