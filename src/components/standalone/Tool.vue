<template>
  <div class="tool" @click="navigate">
    <div class="tool-content">
      <i :class="icon"></i>
      <div class="tool-text">
        <h4>{{ name }}</h4>
        <p v-show="isWide">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Tool",
  props: {
    description: String,
    icon: String,
    isWide: Boolean,
    name: String,
    route: {
      type: String,
      default: "none"
    }
  },
  methods: {
    navigate() {
      if (this.route !== "none") {
        this.$router.push(this.route);
      }
    }
  }
});
</script>

<style scoped lang="scss">
.tool {
  @include bouncy;
  display: inline-block;
  background-color: black;
  border-radius: 16px;
  color: white;
  height: 8rem;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #232323;
  }
  &:active {
    background-color: black;
    color: #aaa;
  }
}
.tool-content {
  height: calc(100% - 2rem);
  width: calc(100% - 2rem);
  margin: 1rem;
  position: relative;

  i,
  .tool-text {
    position: absolute;
    left: 0;
    user-select: none;
  }
  i {
    top: 0;
    font-size: 2rem;
  }
  .tool-text {
    bottom: 0;

    h4,
    p {
      margin-bottom: 0;
    }
    p {
      margin-top: 0.5rem;
    }
  }
}

@media screen and (max-width: 800px) {
  .tool-content {
    i {
      font-size: 1.5rem;
    }
    .tool-text {
      font-size: 1rem;
    }
  }
}

@media screen and (max-width: 480px) {
  .tool {
    height: 6rem;
  }
  .tool-content {
    i {
      font-size: 1.25rem;
    }
    .tool-text {
      font-size: 0.875rem;
    }
  }
}
</style>
