<template>
  <div class="styled-input">
    <label :for="id">{{ label }}</label>
    <input
      type="search"
      :id="id"
      @input="submitSearch"
      ref="input"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchBar",
  data() {
    return {
      lastSearch: 0
    };
  },
  methods: {
    focus() {
      (this.$refs.input as HTMLInputElement).focus();
    },
    submitSearch(e: HTMLInputEvent) {
      e.preventDefault();
      this.$emit("search", e.target.value);
    }
  },
  props: {
    id: {
      required: true,
      type: String
    },
    label: String,
    disabled: Boolean
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
