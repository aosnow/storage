<template>
  <div id="app">

    <h2>登录测试:</h2>
    <el-form label-width="100px">
      <el-form-item label="username:">
        <el-input v-model="username"></el-input>
      </el-form-item>

      <el-form-item label="password:">
        <el-input v-model="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="userlogin">登录</el-button>
        <el-button @click="userexit">退出</el-button>
      </el-form-item>

      <el-form-item label="cover-test">
        <el-button @click="coverCache">重复覆盖存储（path: /）</el-button>
        <el-button @click="removeCoverCache">删除覆盖存储缓存</el-button>
        <el-button @click="getCache">取值</el-button>
        <div>{{ cacheData }}</div>
      </el-form-item>

      <el-form-item label="cover-test2">
        <el-button @click="coverCache2">重复覆盖存储（path: /index）</el-button>
        <el-button @click="removeCoverCache2">删除覆盖存储缓存</el-button>
        <el-button @click="getCache2">取值</el-button>
        <div>{{ cacheData2 }}</div>
      </el-form-item>

      <el-form-item>
        {{ loginfo }}
      </el-form-item>
    </el-form>

    <!--<el-button @click="userexit">退出</el-button>-->
    <!--<el-button @click="handler">点击请求新的数据</el-button>-->
    <!--<el-button @click="persistedHandler">PersistedState[ {{isRooted}} ]</el-button>-->
    <!--<pre class="dataset">{{dataset}}</pre>-->

  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'app',
  mixins: [],
  components: {},
  data() {
    return {
      key: '',
      value: '',

      cacheData: null,
      cacheData2: null,

      username: 'huhuan',
      password: '123456'
    };
  },

  computed: {
    loginfo() {
      return this.$store.getters['user/loginfo'];
    }
  },

  methods: {

    ...mapActions({
      login: 'user/login',
      logout: 'user/logout'
    }),

    userlogin() {
      const { username, password } = this;
      this.login({ username, password }).then(data => {
        console.warn('ui.userlogin', data);
      });
    },

    userexit() {
      this.logout().then(() => {
        Vue.storage.remove('user/login');
      });
    },

    coverCache() {
      const data = { a: Math.random(), b: '测试1' };
      data[Math.random() * 100 >> 0] = 'rand key';
      Vue.storage.cache('cover-test', data, { cookie: { path: '/' } });
    },

    coverCache2() {
      const data = { a: Math.random(), b: '测试2' };
      data[Math.random() * 100 >> 0] = 'rand key2';
      Vue.storage.cache('cover-test', data, { cookie: { path: '/index' } });
    },

    removeCoverCache2() {
      Vue.storage.remove('cover-test', { cookie: { path: '/index' } });
    },

    removeCoverCache() {
      Vue.storage.remove('cover-test', { cookie: { path: '/' } });
    },

    getCache() {
      this.cacheData = Vue.storage.resolve('cover-test', { cookie: { path: '/' } });
      console.warn('cacheData:', this.cacheData);
    },

    getCache2() {
      this.cacheData2 = Vue.storage.resolve('cover-test', { cookie: { path: '/index' } });
      console.warn('cacheData2:', this.cacheData2);
    }

  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 50px;
}

</style>
