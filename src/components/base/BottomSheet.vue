<template>
  <transition name="fade" @after-enter="showSheet = true">
    <div class="dialog-background" ref="root" v-show="visible">
      <transition name="slide" @after-leave="dismiss">
        <div class="bottom-sheet" v-show="showSheet">
          <transition name="fade">
            <div class="loading-overlay" v-show="loading">
              <LoadingIcon />
            </div>
          </transition>
          <div class="bottom-sheet-title">
            <div class="left">
              <h1><slot name="title"></slot></h1>
              <p><slot name="subtitle"></slot></p>
            </div>
            <div class="right" @click="close">
              <i class="la la-times"></i>
            </div>
          </div>
          <div class="bottom-sheet-content">
            <slot name="content"></slot>
          </div>
          <div class="bottom-sheet-action" v-show="!noActions">
            <p class="actions-caption"><slot name="actions-caption"></slot></p>
            <div class="actions"><slot name="actions"></slot></div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoadingIcon from "@/components/standalone/LoadingIcon.vue";

export default defineComponent({
  name: "BottomSheet",
  components: {
    LoadingIcon
  },
  data() {
    return {
      showSheet: false
    };
  },
  emits: ["dismiss"],
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    noActions: {
      default: false,
      type: Boolean
    },
    visible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    close() {
      this.showSheet = false;
    },
    dismiss() {
      this.$emit("dismiss");
    }
  }
});
</script>

<style scoped lang="scss">
@import "../../styles/Dialog";

.bottom-sheet {
  max-width: 768px;
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bottom-sheet-title {
    position: sticky;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: [left] 1fr [right] 2rem;
    grid-template-rows: 1fr;
    grid-column-gap: 1.5rem;
    background: white;
    z-index: 5;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .left {
      grid-area: left;

      h1 {
        margin: 0;
      }
      p {
        margin-bottom: 0;
      }
    }
    .right {
      grid-area: right;

      i {
        font-size: 2rem;
        cursor: pointer;
      }
    }
  }
  .bottom-sheet-content {
    margin: 1.5rem;
  }
  .bottom-sheet-action {
    position: sticky;
    padding: 1.5rem;
    bottom: 0;
    left: 0;
    z-index: 5;
    background: white;
    border-top: 1px solid rgba(0, 0, 0, 0.1);

    .actions-caption {
      margin-top: 0;
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 1fr;
      grid-column-gap: 1rem;
    }
  }
}
</style>
