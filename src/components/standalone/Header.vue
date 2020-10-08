<template>
  <div class="view-header" :border="border">
    <h1><slot></slot></h1>
    <p><slot name="subtitle"></slot></p>
    <slot name="body"></slot>
    <hr v-show="border" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",
  props: {
    border: Boolean
  }
});
</script>

<style scoped lang="scss">
.view-header {
  padding: 0 0 2rem;

  &[border="true"] {
    position: sticky;
    padding: 0;
  }
}
hr {
  background: rgba(0, 0, 0, 0.2);
  border: none;
  height: 1px;
  margin: 2rem 0;
}
</style>
