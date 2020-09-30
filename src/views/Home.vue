<template>
  <div class="home">
    <component :is="isLoggedIn ? 'Tools' : 'Intro'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Intro from "@/components/Intro.vue";
import Tools from "@/components/Tools.vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Home",
  components: {
    Intro,
    Tools
  },
  computed: mapState(["isLoggedIn"])
});
</script>
