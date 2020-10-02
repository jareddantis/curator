<template>
  <div class="styled-input">
    <label :for="id">{{ label }}</label>
    <input type="search" :id="id" @keydown.enter="submitSearch" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchBar",
  props: {
    id: {
      required: true,
      type: String
    },
    label: String
  },
  data() {
    return {
      lastSearch: 0
    };
  },
  methods: {
    submitSearch(e: HTMLInputEvent) {
      e.preventDefault();

      // Rate limit: once every second
      if (this.lastSearch !== 0) {
        const now = new Date().getTime();
        if (now - this.lastSearch < 1000) {
          return;
        }
        this.lastSearch = now;
      }

      this.$emit("search", e.target.value);
    }
  }
});
</script>

<style scoped lang="scss">
input {
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  border-radius: 100px;
  border: 1px solid black;
  outline: none;
  -webkit-appearance: none;
}
</style>
