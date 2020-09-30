<template>
  <nav role="navigation" :sticky="isLoggedIn" :transparent="isTransparent">
    <ul class="nav-content" :narrow="isLoggedIn">
      <li class="nav-left" v-show="hasBackButton" @click="$router.go(-1)">
        <i class="la la-arrow-left"></i>
      </li>
      <li class="nav-brand" @click="scrollToTop">
        <img src="@/assets/logo.svg" alt="Curator" />
        <h3 v-show="!isLoggedIn">Curator</h3>
      </li>
      <li class="nav-right" v-if="isLoggedIn">
        <i class="la la-angle-down"></i>
        <ul class="dropdown">
          <li @click="store.commit('logout')">
            <span class="title">Sign out</span>
            <span class="subtitle">
              Signed in as <strong>aureljared</strong>
            </span>
          </li>
        </ul>
      </li>
      <li class="nav-right" v-else>
        <RoundButton small @click="store.commit('login')">Sign in</RoundButton>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import RoundButton from "@/components/RoundButton.vue";

export default defineComponent({
  name: "Navbar",
  components: {
    RoundButton
  },
  props: {
    hasBackButton: Boolean
  },
  data() {
    return {
      y: 0
    };
  },
  computed: {
    isTransparent(): boolean {
      return this.isLoggedIn ? false : this.y < 32;
    },
    ...mapState(["isLoggedIn"])
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
  width: 100vw;
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
  list-style-type: none;
  padding-left: 0;

  li {
    display: block;
    position: relative;
    text-decoration: none;

    &:hover {
      cursor: pointer;
    }
  }
}

.nav-content {
  height: 2rem;
  width: calc(100vw - 4rem);
  margin: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &[narrow="true"] {
    max-width: 768px;
  }
  i {
    font-size: 1.5rem;
  }
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
          font-size: 0.8rem;
        }
      }
    }
  }
  .nav-right:hover > .dropdown,
  .nav-right:focus-within > .dropdown,
  .dropdown:hover,
  .dropdown:focus {
    visibility: visible;
    opacity: 1;
    display: block;
  }
}

.nav {
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
  }
}
</style>
