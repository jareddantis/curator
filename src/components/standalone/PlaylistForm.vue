<template>
  <div class="playlist-form">
    <div class="field">
      <div class="counter">
        <label for="playlist-name">Name (required)</label>
        <span>{{ details.name.length }} / 100</span>
      </div>
      <input
        type="text"
        id="playlist-name"
        maxlength="100"
        v-model="details.name"
      />
    </div>
    <div class="field">
      <div class="counter">
        <label for="playlist-desc">Description</label>
        <span>{{ details.description.length }} / 300</span>
      </div>
      <input
        type="text"
        id="playlist-desc"
        maxlength="300"
        v-model="details.description"
      />
    </div>
    <div class="field level">
      <div class="left">
        <div>
          <label for="playlist-art">Artwork</label>
          <p>
            Please ensure that you hold rights over the artwork you choose.
            <span v-show="!isNewPlaylist">
              <br />Leave blank to keep existing playlist art.
            </span>
          </p>
        </div>
      </div>
      <div class="right file">
        <input
          type="file"
          id="playlist-art"
          accept="image/jpeg"
          @change="onArtChanged"
        />
        <label for="playlist-art" ref="preview">
          <i class="la la-plus"></i>
          <i class="la la-times" @click="resetArt"></i>
        </label>
      </div>
    </div>
    <div class="field level" :disabled="details.collaborative">
      <div class="left">
        <div>
          <label for="playlist-privacy">Make this playlist public</label>
          <p v-if="details.collaborative">
            Collaborative playlists must be private
          </p>
          <p v-else>Will be visible on your Spotify profile</p>
        </div>
      </div>
      <div class="right checkbox">
        <input
          type="checkbox"
          id="playlist-privacy"
          v-model="details.isPublic"
          :disabled="details.collaborative"
        />
        <label for="playlist-privacy">
          <i class="la la-toggle-on"></i>
          <i class="la la-toggle-off"></i>
        </label>
      </div>
    </div>
    <div class="field level" :disabled="details.isPublic">
      <div class="left">
        <div>
          <label for="playlist-perms">Allow collaboration</label>
          <p v-if="details.isPublic">
            Collaborative playlists cannot be isPublic
          </p>
          <p v-else>Other people will be able to edit</p>
        </div>
      </div>
      <div class="right checkbox">
        <input
          type="checkbox"
          id="playlist-perms"
          v-model="details.collaborative"
          :disabled="details.isPublic"
        />
        <label for="playlist-perms">
          <i class="la la-toggle-on"></i>
          <i class="la la-toggle-off"></i>
        </label>
      </div>
    </div>
    <div class="field level" v-show="isNewPlaylist">
      <div class="left">
        <div>
          <label for="playlist-populate">Add tracks now</label>
          <p>You can always do this later</p>
        </div>
      </div>
      <div class="right checkbox">
        <input
          type="checkbox"
          id="playlist-populate"
          v-model="details.populate"
        />
        <label for="playlist-populate">
          <i class="la la-toggle-on"></i>
          <i class="la la-toggle-off"></i>
        </label>
      </div>
    </div>
    <div class="submit">
      <RoundButton full-width @click="submit" :disabled="disabled">
        Save
      </RoundButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RoundButton from "@/components/base/RoundButton.vue";

export default defineComponent({
  name: "PlaylistForm",
  components: {
    RoundButton
  },
  data() {
    return {
      details: {
        name: "",
        description: "",
        collaborative: false,
        isPublic: true,
        populate: false
      } as PlaylistDetails
    };
  },
  methods: {
    onArtChanged(e: HTMLInputEvent) {
      const { files } = e.target;
      const preview = this.$refs.preview as HTMLLabelElement;

      if (!!files && files.length && !!files[0]) {
        const fileSize = Math.round(files[0].size / 1024);
        if (fileSize > 256) {
          window.alert(
            `Your file is ${fileSize} KB. Playlist artwork must not exceed 256 KB.`
          );
          this.resetArt();
          return;
        }
        const reader = new FileReader();

        reader.onload = (function(el: HTMLLabelElement) {
          return function(ev: ProgressEvent<FileReader>) {
            if (!!ev.target && typeof ev.target.result == "string") {
              const imageData = ev.target.result;
              el.style.backgroundImage = `url("${imageData}"`;
              el.classList.add("populated");
            } else {
              el.style.backgroundImage = "";
              el.classList.remove("populated");
            }
          };
        })(preview);
        reader.readAsDataURL(files[0]);
      } else {
        preview.style.backgroundImage = "";
        preview.classList.remove("populated");
      }
    },
    resetArt(e?: HTMLInputEvent) {
      e?.preventDefault();
      const fileInput = document.getElementById(
        "playlist-art"
      ) as HTMLInputElement;
      const preview = this.$refs.preview as HTMLLabelElement;
      fileInput.value = "";
      preview.style.backgroundImage = "";
      preview.classList.remove("populated");
    },
    submit() {
      const preview = this.$refs.preview as HTMLLabelElement;
      const art = preview.style.backgroundImage.split('"')[1] || "";
      const {
        name,
        description,
        collaborative,
        isPublic,
        populate
      } = this.details;
      this.$emit("submit", {
        name,
        description,
        isPublic,
        collaborative,
        art,
        populate
      });
    }
  },
  props: {
    disabled: Boolean,
    isNewPlaylist: Boolean,
    origCollab: Boolean,
    origName: String,
    origDesc: String,
    origPublic: Boolean
  },
  watch: {
    origCollab(after) {
      this.details.collaborative = after;
    },
    origName(after) {
      this.details.name = after;
    },
    origDesc(after) {
      this.details.description = after;
    },
    origPublic(after) {
      this.details.isPublic = after;
    }
  }
});
</script>

<style scoped lang="scss">
.playlist-form {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-row-gap: 2rem;

  .submit {
    width: 100%;
    margin-top: 2rem;
  }
  .field {
    &[disabled="true"] {
      opacity: 0.7;
      pointer-events: none;
    }
    input[type="text"] {
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: 1.25rem;
      margin-top: 0.5rem;
    }
    .counter {
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 0.8rem;
        text-align: right;
      }
    }
    label {
      display: block;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    &.level {
      display: grid;
      grid-template-columns: [left] auto [right] 4rem;
      grid-template-rows: 1fr;
      grid-column-gap: 1rem;

      & > div {
        display: flex;
        align-items: center;
      }
      .left {
        justify-content: start;
        grid-area: left;

        p {
          margin: 0;
          font-size: 0.9rem;
        }
      }
      .right {
        grid-area: right;
        text-align: right;
        justify-self: end;

        input {
          position: absolute;
          left: -999999rem;
        }
        label {
          cursor: pointer;
          user-select: none;
          outline: none;
          font-size: 2.5rem;
          margin: 0;
        }
        &.file {
          label {
            @include bouncy;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid black;
            width: 4rem;
            height: 4rem;
            position: relative;

            .la-times {
              display: none;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 4;
            }
            &.populated {
              background-size: cover;

              &:after {
                display: block;
                content: " ";
                background: rgba(255, 255, 255, 0.4);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
              .la-plus {
                display: none;
              }
              .la-times {
                display: block;
              }
            }
          }
        }
        &.checkbox {
          label i {
            @include bouncy(0.92, $duration: 200ms);

            &.la-toggle-off {
              display: block;
            }
            &.la-toggle-on {
              display: none;
            }
          }
          input {
            &:checked ~ label .la-toggle-on {
              display: block;
            }
            &:checked ~ label .la-toggle-off {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
