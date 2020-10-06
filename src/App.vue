<template>
  <Navbar />
  <div
    class="app-view"
    :with-margin="store.getters.isLoggedIn"
    v-if="$route.name !== 'Callback'"
  >
    <router-view v-slot="{ Component }">
      <transition
        :name="transitionName"
        mode="out-in"
        @before-leave="beforeLeave"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <router-view v-else></router-view>
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      prevHeight: "0",
      transitionName: "zoom-in"
    };
  },
  setup() {
    return {
      store: useStore()
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      if (to.path == from.path) {
        this.transitionName = "";
      } else {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        const isGoingHome = to.path == "/" && from.path.length > 1;
        this.transitionName =
          isGoingHome || toDepth < fromDepth ? "zoom-out" : "zoom-in";
      }
      next();
    });
  },
  methods: {
    beforeLeave(el: HTMLElement) {
      this.prevHeight = getComputedStyle(el).height;
    },
    enter(el: HTMLElement) {
      const { height } = getComputedStyle(el);

      el.style.height = this.prevHeight;

      setTimeout(() => {
        el.style.height = height;
      });
    },
    afterEnter(el: HTMLElement) {
      el.style.height = "auto";
    }
  }
});
</script>

<style lang="scss">
// Sane defaults
:root {
  font-size: 16px;
}
* {
  box-sizing: border-box;
}
html {
  touch-action: manipulation;
  min-height: 100vh;
  background: #232323;
}
body {
  margin: 0;
  background: white;
}
h1,
h2,
h3,
h4,
h5,
h6,
p,
li,
a,
button,
input,
td,
span,
label {
  font-family: "Inter", -apple-system, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
}
p,
li,
a,
button,
input,
td,
span,
label {
  font-weight: 450;
}
button {
  outline: none;
  cursor: pointer;
}

// Actual styles
.app-view[with-margin="true"] {
  max-width: calc(768px + 4rem);
  width: 100%;
  margin: 0 auto 4rem;
}
.view-body {
  margin: 0 2rem;
}
@media screen and (max-width: 480px) {
  .app-view[with-margin="true"] {
    margin-bottom: 1.5rem;
  }
  .view-body {
    margin: 0 1.5rem;
  }
}

// Router transitions
.zoom-in-leave-from,
.zoom-in-enter-to,
.zoom-out-leave-from,
.zoom-out-enter-to {
  opacity: 1;
  transform: scale(1);
}
.zoom-in-leave-to,
.zoom-in-enter-from,
.zoom-out-leave-to,
.zoom-out-enter-from {
  opacity: 0;
}
.zoom-in-leave-to,
.zoom-out-enter-from {
  transform: scale(1.02);
}
.zoom-in-enter-from,
.zoom-out-leave-to {
  transform: scale(0.98);
}
.zoom-in-leave-active,
.zoom-in-enter-active,
.zoom-out-leave-active,
.zoom-out-enter-active {
  transition-duration: 200ms;
  transition-property: height, opacity, transform;
  overflow: hidden;
}
.zoom-in-leave-active,
.zoom-out-leave-active {
  transition-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
}
.zoom-in-enter-active,
.zoom-out-enter-active {
  transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
