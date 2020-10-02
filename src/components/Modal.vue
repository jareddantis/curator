<template>
  <transition name="fade" @after-enter="showSheet = true">
    <div
      class="modal-background"
      ref="root"
      v-show="visible"
      @click="hideSheet"
    >
      <transition name="zoom" @after-leave="dismiss">
        <div class="modal" v-show="showSheet">
          <div class="modal-contents" v-if="loading">
            <keep-alive>
              <div class="spinner"></div>
            </keep-alive>
            <div class="spinner-text">
              <h3><slot></slot></h3>
            </div>
          </div>
          <div class="modal-contents" v-else>
            <div class="modal-title">
              <h2><slot name="title"></slot></h2>
            </div>
            <div class="modal-content">
              <slot name="content"></slot>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  data() {
    return {
      showSheet: false
    };
  },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    dismissible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    hideSheet() {
      if (this.dismissible) {
        this.showSheet = false;
      }
    },
    dismiss() {
      if (this.dismissible) {
        this.$emit("dismiss");
      }
    }
  }
});
</script>

<style scoped lang="scss">
.modal-background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  .modal {
    max-width: 400px;
    width: 100%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-contents {
      margin: 1rem 0;
    }
  }
}

// Transition
.zoom-enter-from,
.zoom-leave-to,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.zoom-enter-to,
.zoom-leave-from,
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.zoom-enter-to,
.zoom-leave-from {
  transform: scale(1);
}
.zoom-enter-from {
  transform: scale(1.1);
}
.zoom-leave-to {
  transform: scale(0.9);
}
.zoom-enter-active {
  transition: all 200ms cubic-bezier(0.33, 1, 0.68, 1);
}
.zoom-leave-active {
  transition: all 100ms ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 100ms ease;
}

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
