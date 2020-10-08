<template>
  <keep-alive>
    <div class="spinner"></div>
  </keep-alive>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoadingIcon"
});
</script>

<style scoped lang="scss">
// https://tobiasahlin.com/spinkit/
.spinner {
  width: 40px;
  height: 40px;
  margin: 2rem auto;
  background-color: #333;
  border-radius: 100%;
  will-change: transform;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>
