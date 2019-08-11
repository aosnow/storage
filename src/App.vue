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

      <el-form-item>
        {{loginfo}}
      </el-form-item>
    </el-form>

    <el-button @click="userexit">退出</el-button>
    <el-button @click="handler">点击请求新的数据</el-button>
    <el-button @click="persistedHandler">PersistedState[ {{isRooted}} ]</el-button>
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
      cookies: null,
      isRooted: true,
      username: 'huhuan',
      password: '123456'
    };
  },

  computed: {
    loginfo() {
      return this.$store.getters['user/loginfo'];
    }
  },

  created() {
    console.warn(Vue.storage);
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
