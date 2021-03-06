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
import Navbar from "@/components/standalone/Navbar.vue";
import Footer from "@/components/standalone/Footer.vue";

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
@import "styles/_reset";

.app-view[with-margin="true"] {
  max-width: calc(768px + 4rem);
  width: 100%;
  margin: 0 auto 4rem;
}
.view-body {
  margin: 0 2rem;

  .view-action {
    position: sticky;
    bottom: 0;
    left: 0;
    background: white;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    z-index: 5;

    .view-action-content {
      margin: 0 auto;
      max-width: calc(768px);
      padding: 1.5rem 0;
      width: 100%;

      p {
        margin-top: 0;
      }
    }
  }
}
.jump-link {
  text-align: right;
  font-weight: 700;
  cursor: pointer;
}
@media screen and (max-width: 480px) {
  .app-view[with-margin="true"] {
    margin-bottom: 1.5rem;
  }
  .view-body {
    margin: 0 1.5rem;
  }
}
</style>
