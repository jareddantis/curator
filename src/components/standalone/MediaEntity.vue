<template>
  <div
    class="media-entity"
    :selected="selected"
    @mouseenter="mouseDown"
    @mouseleave="mouseUp"
  >
    <div class="preview-tooltip" :visible="showTooltip">
      <p>{{ tooltipText }}</p>
    </div>
    <div class="progress" ref="progress"></div>
    <div class="art">
      <div class="selected">
        <i class="la la-check"></i>
      </div>
      <img :src="art" :alt="name" />
    </div>
    <div class="info">
      <div class="info-content">
        <div class="no-overflow-parent name">
          <div class="no-overflow">
            <span class="title">{{ name }}</span>
            <span class="tag" v-show="explicit">E</span>
          </div>
        </div>
        <div class="no-overflow-parent detail">
          <div class="no-overflow">
            <span class="tag" v-show="tag">{{ tag }}</span>
            <span class="subtitle"><slot></slot></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import getTrack from "@/api/composables/GetTrack";

export default defineComponent({
  name: "MediaEntity",
  computed: {
    art(): string {
      return this.image || "/img/dummy-art.svg";
    },
    preview(): string {
      return this.previewUrl || this.fetchedPreviewUrl;
    }
  },
  data() {
    return {
      fetchedPreviewUrl: "",
      holdTimer: 0,
      player: new Audio(),
      showTooltip: false,
      tooltipText: "Previewing"
    };
  },
  methods: {
    mouseDown() {
      this.mouseUp();
      this.holdTimer = window.setTimeout(() => {
        if (this.previewable) {
          this.showTooltip = true;
        }
        if (this.preview) {
          this.player.play();
        }
      }, 500);
    },
    mouseUp(e?: MouseEvent | TouchEvent) {
      this.showTooltip = false;
      if (this.holdTimer) {
        window.clearTimeout(this.holdTimer);
      }
      if (this.previewable) {
        e?.preventDefault();
      }
      if (this.preview) {
        if (!this.player.paused) {
          this.player.pause();
          this.player.currentTime = 0;
        }
      }
    },
    rightClickHandler() {
      return false;
    }
  },
  mounted() {
    this.player.src = this.previewUrl;
    this.player.ontimeupdate = () => {
      const bar = this.$refs.progress as HTMLDivElement;
      bar.style.width = `${Math.ceil(
        (this.player.currentTime / this.player.duration) * 100
      )}%`;
    };
    this.player.onended = () => {
      this.player.currentTime = 0;
    };

    // The Spotify Search endpoint often returns a null preview_url
    // for track results, but the same tracks have a proper preview_url
    // when queried through the Get a Track endpoint.
    // Let's try to make use of that here.
    if (this.previewable && !this.previewUrl) {
      this.tooltipText = "Looking for preview";
      this.store
        .dispatch("getUpdatedToken")
        .then(token => this.task.perform(token, this.trackId))
        .then(({ preview_url }) => {
          if (preview_url) {
            this.tooltipText = "Previewing";
            this.fetchedPreviewUrl = preview_url;
          } else {
            this.tooltipText = "No preview available";
          }
        });
    }
  },
  props: {
    explicit: Boolean,
    name: {
      type: String,
      required: true
    },
    image: String,
    previewable: Boolean,
    previewUrl: {
      type: String,
      default: ""
    },
    selected: Boolean,
    tag: {
      type: String,
      default: ""
    },
    trackId: String
  },
  setup() {
    return {
      store: useStore(),
      task: getTrack()
    };
  },
  watch: {
    preview(after) {
      this.player.src = after;
      this.player.currentTime = 0;
    }
  }
});
</script>

<style scoped lang="scss">
.media-entity {
  @include bouncy;
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 3rem 1fr;
  grid-template-rows: 3rem;
  grid-column-gap: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  .preview-tooltip {
    position: absolute;
    z-index: 10;
    bottom: 4rem;
    left: 0;
    background: #9c0032;
    color: white;
    display: none;
    width: unset;
    height: 0.875rem;
    align-items: center;
    padding: 1rem 0.5rem;
    border-radius: 10px;

    &[visible="true"] {
      display: flex;
    }
    &:after {
      content: " ";
      display: block;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-color: #9c0032;
      position: absolute;
      top: 2rem;
      left: 1rem;
    }
    p {
      font-weight: 700;
      font-size: 0.875rem;
      line-height: 0.875rem;
      margin: 0;
    }
  }
  .progress {
    position: absolute;
    z-index: 5;
    background: rgba(156, 0, 50, 0.2);
    width: 0;
    height: 5rem;
    top: -1rem;
    left: 0;
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
  white-space: nowrap;
  overflow: hidden;

  .info-content {
    width: 100%;

    .no-overflow-parent {
      width: 100%;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.name {
        margin-bottom: 0.0625rem;

        .no-overflow .tag {
          margin-left: 0.375rem;
          font-weight: 800;
          padding: 0 3px;
        }
      }
      &.detail .tag {
        margin-right: 0.25rem;
      }
      .no-overflow {
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;

        .title,
        .subtitle {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .title {
          font-weight: 700;
        }
        .tag {
          flex: 0 0 auto;
          text-transform: uppercase;
          font-weight: 700;
          background: black;
          color: white;
          padding: 0 2px;
          border-radius: 3px;
          border: 1px solid black;
          font-size: 0.75rem;
          vertical-align: middle;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .media-entity {
    grid-template-columns: 2.25rem 1fr;
    grid-template-rows: 2.25rem;
    margin-bottom: 1.5rem;

    .preview-tooltip {
      bottom: 3.5rem;
    }
    .progress {
      top: -0.75rem;
      height: 3.75rem;
    }
    &:not(:last-child):after {
      bottom: -0.75rem;
    }
    .info .info-content {
      .title,
      .subtitle {
        font-size: 0.875rem;
      }
      .tag {
        font-size: 0.625rem;
      }
    }
    &:active {
      transform: scale(0.99);
    }
  }
}
</style>
