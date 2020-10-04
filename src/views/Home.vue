<template>
  <div class="home">
    <component :is="store.getters.isLoggedIn ? 'Tools' : 'Intro'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Intro from "@/components/Intro.vue";
import Tools from "@/components/Tools.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Home",
  components: {
    Intro,
    Tools
  },
  setup() {
    return {
      store: useStore()
    };
  }
});
</script>
