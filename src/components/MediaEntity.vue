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
        <p>
          <span class="tag" v-show="tag">{{ tag }}</span>
          <slot></slot>
        </p>
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
    },
    tag: {
      type: String,
      default: ""
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
  &[small="true"] {
    grid-template-columns: 2rem 1fr;
    grid-template-rows: 2rem;
    margin-bottom: 1.5rem;

    &:not(:last-child):after {
      bottom: -0.75rem;
    }
    .info .info-content {
      h3 {
        font-size: 0.875rem;
      }
      p {
        margin-top: 0.125rem;
        font-size: 0.75rem;
      }
    }
    &:active {
      transform: scale(0.99);
    }
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
  overflow: hidden;

  .info-content {
    overflow: hidden;

    h3,
    p {
      user-select: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    h3 {
      margin: 0;
      width: 100%;
    }
    p {
      font-size: 0.875rem;
      margin: 0.25rem 0 0;
      font-weight: 500;

      .tag {
        text-transform: uppercase;
        font-weight: 700;
        display: inline-block;
        color: black;
        padding: 0 3px;
        margin-right: 0.25rem;
        border-radius: 3px;
        border: 1px solid black;
        font-size: 0.625rem;
        vertical-align: top;
      }
    }
  }
}
</style>
