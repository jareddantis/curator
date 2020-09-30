<template>
  <div class="view-header">
    <h1><slot></slot></h1>
    <p><slot name="subtitle"></slot></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header"
});
</script>

<style scoped lang="scss">
.view-header {
  padding: 2rem 0;
}
</style>
