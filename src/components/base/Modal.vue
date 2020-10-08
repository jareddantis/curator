<template>
  <transition name="fade" @after-enter="showSheet = true">
    <div
      class="dialog-background"
      ref="root"
      v-show="visible"
      @click="hideSheet"
    >
      <transition name="zoom" @after-leave="dismiss">
        <div class="modal" v-show="showSheet">
          <div class="modal-contents" v-if="loading">
            <LoadingIcon />
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
import LoadingIcon from "@/components/standalone/LoadingIcon.vue";

export default defineComponent({
  name: "Modal",
  components: {
    LoadingIcon
  },
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
@import "../../styles/Dialog";

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
</style>
