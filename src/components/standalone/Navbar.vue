<template>
  <nav
    role="navigation"
    :sticky="store.getters.isLoggedIn"
    :transparent="isTransparent"
    v-show="$route.name !== 'Callback'"
  >
    <ul class="nav-content" :narrow="store.getters.isLoggedIn">
      <li
        class="nav-left"
        v-show="$route.name !== 'Home'"
        @click="$router.go(-1)"
      >
        <i class="la la-arrow-left"></i>
      </li>
      <li class="nav-brand" @click="scrollToTop">
        <img src="@/img/logo.svg" alt="Curator" />
        <h3 v-show="!store.getters.isLoggedIn">Curator</h3>
      </li>
      <li class="nav-right" v-show="store.getters.isLoggedIn">
        <i class="la la-angle-down"></i>
        <ul class="dropdown">
          <li @click="store.commit('reset')">
            <span class="title">Sign out</span>
            <span class="subtitle">
              Signed in as <strong>{{ id }}</strong>
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";

export default defineComponent({
  name: "Navbar",
  props: {
    hasBackButton: Boolean
  },
  computed: {
    isTransparent(): boolean {
      return !this.store.getters.isLoggedIn && this.y < 32;
    },
    ...mapState(["isLoggedIn", "id"])
  },
  data() {
    return {
      y: 0
    };
  },
  setup() {
    return {
      store: useStore()
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      this.y =
        window.pageYOffset ||
        (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});
</script>

<style scoped lang="scss">
nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  background: white;
  transition: background 100ms linear;
  display: flex;
  align-items: center;
  justify-content: center;

  &[transparent="true"] {
    background: none;
  }
  &[sticky="true"] {
    position: sticky;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    text-decoration: none;

    &:hover {
      cursor: pointer;
    }
  }
}

.nav-content {
  height: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 2rem;

  &[narrow="true"] {
    max-width: 768px;
  }
  i {
    font-size: 1.5rem;
  }

  .nav {
    &-left,
    &-brand {
      display: flex;
    }
    &-brand {
      display: flex;
      align-items: center;
      justify-content: space-between;

      img {
        width: 1.75rem;
        height: 1.75rem;
      }
      h3 {
        margin-left: 0.5rem;
      }
    }
    &-right {
      padding: 1rem 0;
      display: block;
      position: relative;

      .dropdown {
        background: white;
        border: 1px solid #aaaaaa;
        border-radius: 8px;
        visibility: hidden;
        opacity: 0;
        min-width: 14rem;
        position: absolute;
        margin-top: 0.5rem;
        right: 0;
        display: none;

        li {
          clear: both;
          width: 100%;
          padding: 1rem;
          transition: background-color 100ms linear;

          &:hover {
            background-color: #f1f1f1;
          }
          span {
            display: block;

            &.title {
              font-weight: bold;
              font-size: 1rem;
            }
            &.subtitle {
              font-size: 0.75rem;
            }
          }
        }
      }
      &:hover > .dropdown,
      &:focus-within > .dropdown,
      .dropdown:hover,
      .dropdown:focus {
        visibility: visible;
        opacity: 1;
        display: block;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .nav-content {
    margin: 1.5rem;
  }
}
</style>
