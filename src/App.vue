<template>
  <div id="app">

    <h2>Cookie 测试:</h2>
    <el-form label-width="100px">
      <el-form-item label="Key:">
        <el-input v-model="key"></el-input>
        <el-button @click="deleteCookie">删除</el-button>
      </el-form-item>

      <el-form-item label="Value:">
        <el-input v-model="value"></el-input>
      </el-form-item>

      <el-form-item label="Cookies:">
        <el-alert title="" type="info">{{cookies}}</el-alert>
      </el-form-item>

      <el-form-item>
        <el-button @click="setCookie">设置</el-button>
        <el-button @click="getCookie">读取</el-button>
        <el-button @click="clearCookie">清空</el-button>
      </el-form-item>
    </el-form>

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
      </el-form-item>
    </el-form>

    <el-button @click="userexit">退出</el-button>
    <el-button @click="handler">点击请求新的数据</el-button>
    <el-button @click="persistedHandler">PersistedState[ {{isRooted}} ]</el-button>
    <!--<pre class="dataset">{{dataset}}</pre>-->

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Cookie } from '@mudas/storage';

export default {
  name: 'app',
  mixins: [],
  components: {},
  data() {
    return {
      key: '',
      value: '',
      cookies: null,
      isRooted: true,
      username: 'huhuan',
      password: '123456'
    };
  },

  methods: {
    setCookie() {
      Cookie.setItem(this.key, this.value, {});
    },
    getCookie() {
      this.cookies = document.cookie;
    },
    deleteCookie() {
      Cookie.removeItem(this.key);
    },
    clearCookie() {
      Cookie.clear();
    },

    ...mapActions({
      login: 'user/login',
      logout: 'user/logout'
    }),
    userlogin() {
      const { username, password } = this;
      this.login({ username, password });
    },
    userexit() {
      this.logout();
    },
    handler() {
      // this.$store.dispatch('info/fetch').then(data => {
      //   console.warn(data.data);
      // }).catch(reason => {
      //   console.warn(reason);
      // });
    },
    persistedHandler() {
      this.isRooted = !this.isRooted;
      // setUnique(this.isRooted ? 'root' : 'a$b%cc@42a');
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
