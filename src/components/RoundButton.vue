<template>
  <button :full-width="fullWidth" :small="small">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RoundButton",
  props: {
    fullWidth: Boolean,
    small: Boolean
  }
});
</script>

<style scoped lang="scss">
button {
  border: none;
  background: black;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1rem 1.5rem;
  border-radius: 100px;
  transition: all 150ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: #232323;
  }
  &:active {
    background: black;
    color: #aaa;
    transform: scale(0.97);
  }
  &[full-width="true"] {
    width: 100%;
  }
  &[small="true"] {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}
</style>
