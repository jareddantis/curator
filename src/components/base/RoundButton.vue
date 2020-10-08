<template>
  <button
    :full-width="fullWidth"
    :small="small"
    :disabled="disabled"
    :transparent="transparent"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RoundButton",
  props: {
    fullWidth: Boolean,
    small: Boolean,
    disabled: Boolean,
    transparent: Boolean
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
  &[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }
  &[transparent="true"] {
    background: none;
    border: 1px solid black;
    color: black;

    &:hover {
      background: #eee;
    }
    &:active {
      background: #ddd;
    }
  }
}
</style>
