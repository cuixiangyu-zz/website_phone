<template>
  <div class="login-bg">
    <div id="login">
      <form action>
        <h3>website</h3>
        <ul class="info-login">
          <li>
            <b>
              {{lable}}
              <i class="icon-down"></i>
            </b>
            <input type="text" v-model="loginForm.userName" placeholder="用户名">
          </li>
          <li>
            <span></span>
            <input type="password" v-model="loginForm.password" placeholder="密码">
          </li>
          <li>
            <input @click.prevent="infologin" type="submit" value="进入">
          </li>
        </ul>
      </form>
    </div>
    <!--底部-->
    <div class="login-footer flex_parent">
      <router-link to class="flex_child">
        <span>用户协议</span>
      </router-link>
      <router-link to class="flex_child">
        <span>密码登录</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import sessionStore from '../../js/sessionStore'
import { login } from '@/api/user'
export default {
  data() {
    return {
      isNhad: false,
      userlist: [],
      //1用户信息
      userules: {
        userid: '',
        userpwd: '',
      },
      loginForm: {
        userName: '',
        password: ''
      },
      lable: '+86',
    };
  },
  components: {},
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    },
    userlist: {
      handler: items => {
        sessionStore.save(items)
      },
      deep: true
    }
  },
  methods: {
    infologin() {

          console.log(this.loginForm)
          login(this.loginForm).then(res => {
            this.$router.push({
              path: '/home'
            });
          })
          /*this.$router.push({
            path: '/home'
          });*/
          //console.log(_self.$router);

    },
    adduser() {
      //注册用户，如果已经被注册
      // let _self = this;
      this.haduser()
      if (this.isNhad && this.userules.userid && this.userules.userpwd) {
        this.userlist.push({
          userid: this.userules.userid,
          userpwd: this.userules.userpwd,
        });
        console.log(this.userlist)
      }
    },
    // 过滤注册的用户是否已经存在
    haduser() {
      const items = sessionStore.fetch()
      const len = items.length
      items.forEach(item => {
        if (this.userules.userid !== i.userid) {
          this.isNhad = true
        } else {
          this.isNhad = false
        }
        //console.log(i.userid);
      });
    }
  },
  mounted() {
    //加载之前先给一个可以登录的用户
    const admin = {
      session_id: Math.random().toString(32).slice(2),
      username: 'admin',
      password: '123456',
    };
    // 使用：改变session_id
    this.$store.commit("logIn/getSession_id", admin.session_id)
    this.userlist.push(admin)
    this.userules.userid = admin.userid
    this.userules.userpwd = admin.userpwd
    //console.log("aaa");
  }
};
</script>

<style lang="stylus" scoped>
</style>