<template>
  <div class="media-entity" :selected="selected" :small="small">
    <div class="art">
      <div class="selected">
        <i class="la la-check"></i>
      </div>
      <img :src="art" :alt="name" />
    </div>
    <div class="info">
      <div class="info-content">
        <h3>{{ name }}</h3>
        <p><slot></slot></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MediaEntity",
  computed: {
    art(): string {
      return this.image || "/img/dummy-art.svg";
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    image: String,
    selected: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style scoped lang="scss">
.media-entity {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 3rem 1fr;
  grid-template-rows: 3rem;
  grid-column-gap: 1rem;
  margin-bottom: 2rem;
  transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
  &:not(:last-child):after {
    content: " ";
    display: block;
    position: absolute;
    bottom: -1rem;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }
  & > div {
    width: 100%;
    height: 100%;
  }
  &[selected="true"] {
    .art .selected {
      display: flex;
    }
    .info-content {
      color: #bf0000;
    }
  }
  .art {
    position: relative;

    .selected {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }
    img {
      width: 100%;
    }
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .info-content {
      h3 {
        margin: 0;
      }
      p {
        font-size: 0.85rem;
        margin: 0.25rem 0 0;
      }
    }
  }
}
</style>
