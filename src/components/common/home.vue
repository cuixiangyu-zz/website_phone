<template>
  <div id="home">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <!--组件的应用-->
    <div class="navbar flex_parent">
      <router-link to="/home" class="flex_child">
        <span class="icon-earth"></span>
        <span>日本</span>
      </router-link>
      <router-link @click.native="showitem" to="/americanVideoList" class="flex_child">
        <span class="icon-company"></span>
        <span>欧美</span>
      </router-link>
      <router-link to="/animateList" class="flex_child">
        <span class="icon-message"></span>
        <span>动漫</span>
      </router-link>
      <router-link to="/comicList" class="flex_child">
        <span class="icon-me"></span>
        <span>漫画</span>
      </router-link>
      <router-link to="/pornHubVideoList" class="flex_child">
        <span class="icon-me"></span>
        <span>pornHub</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "主要的内容区域",
      willshow: false,
      isloading: false
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    }
  },
  computed: {
   
  },
  methods: {
    showitem: function() {
      //console.log('aaa');
    },
    beforeEnter(el) {
      console.log(el);
    }
  },
  // 創建后挂载到root之后调用该钩子函数
  mounted() {},
  // 该实例被创建还没挂载root之前，ajax可以在这里
  created() {}
};
</script>

<style lang="stylus" scoped>
@import '../../styles/mixin.styl';

.navbar {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
  z-index: 10;
}

.navbar:before {
  content: '';
  position: absolute;
  left: 0;
  background: #808080;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.3);
  transform: scaleY(0.3);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

.navbar a {
  color: #808080;
  padding: 0.18rem 0;
  transition: all 0.5s;
  text-align: center;

  span {
    display: block;
  }

  [class^='icon-'], [class*=' icon-'] {
    font-size: 0.6rem;
  }
}

.navbar a.router-link-active {
  color: $vuecolor;
}

/* 组件切换的动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

/* .fade-leave-active in <2.1.8 */
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
