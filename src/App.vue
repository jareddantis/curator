<template>
  <Navbar :has-back-button="$route.name !== 'Home'" />
  <div class="app-view" :with-margin="isLoggedIn">
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
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "App",
  components: {
    Navbar,
    Footer
  },
  computed: mapState(["isLoggedIn"]),
  data() {
    return {
      prevHeight: "0",
      transitionName: "zoom-in"
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
* {
  box-sizing: border-box;
}
body {
  margin: 0;
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
}
button {
  outline: none;
  cursor: pointer;
}

// Actual styles
.app-view[with-margin="true"] {
  max-width: 768px;
  width: 100%;
  margin: 0 auto 4rem;
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
