<template>
  <div class="create-playlist view-body">
    <Header>
      <template v-slot:default>Create playlist</template>
    </Header>
    <div class="playlist-form">
      <div class="field">
        <label for="playlist-name">Name (required)</label>
        <input
          type="text"
          id="playlist-name"
          maxlength="100"
          v-model="playlistName"
        />
        <span>{{ playlistName.length }} / 100</span>
      </div>
      <div class="field">
        <label for="playlist-desc">Description</label>
        <input
          type="text"
          id="playlist-desc"
          maxlength="300"
          v-model="playlistDesc"
        />
        <span>{{ playlistDesc.length }} / 100</span>
      </div>
      <div class="field level">
        <div class="left">
          <div>
            <label for="playlist-art">Artwork</label>
            <p>
              Please ensure that you hold rights over the artwork you choose.
            </p>
          </div>
        </div>
        <div class="right file">
          <input
            type="file"
            id="playlist-art"
            accept="image/png,image/jpeg"
            @change="onArtChanged"
          />
          <label for="playlist-art" id="playlist-art-preview">
            <i class="la la-plus"></i>
            <i class="la la-times" @click="resetArt"></i>
          </label>
        </div>
      </div>
      <div class="field level">
        <div class="left">
          <div>
            <label for="playlist-privacy">Make this playlist public</label>
            <p>Will be visible on your Spotify profile</p>
          </div>
        </div>
        <div class="right checkbox">
          <input
            type="checkbox"
            id="playlist-privacy"
            v-model="playlistPrivacy"
          />
          <label for="playlist-privacy">
            <i class="la la-toggle-on"></i>
            <i class="la la-toggle-off"></i>
          </label>
        </div>
      </div>
      <div class="field level">
        <div class="left">
          <div>
            <label for="playlist-perms">Allow collaboration</label>
            <p>Other people will be able to edit</p>
          </div>
        </div>
        <div class="right checkbox">
          <input type="checkbox" id="playlist-perms" v-model="playlistPerms" />
          <label for="playlist-perms">
            <i class="la la-toggle-on"></i>
            <i class="la la-toggle-off"></i>
          </label>
        </div>
      </div>
      <div class="field level">
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
            v-model="playlistPopulate"
          />
          <label for="playlist-populate">
            <i class="la la-toggle-on"></i>
            <i class="la la-toggle-off"></i>
          </label>
        </div>
      </div>
      <div class="submit">
        <RoundButton full-width>Proceed</RoundButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import RoundButton from "@/components/RoundButton.vue";

export default defineComponent({
  name: "CreatePlaylist",
  components: {
    Header,
    RoundButton
  },
  data() {
    return {
      playlistName: "",
      playlistDesc: "",
      playlistPrivacy: true,
      playlistPerms: false,
      playlistPopulate: false,
      playlistArt: null
    };
  },
  methods: {
    onArtChanged(e: HTMLInputEvent) {
      const { files } = e.target;
      const el = document.getElementById(
        "playlist-art-preview"
      ) as HTMLLabelElement;
      if (!!files && files.length && !!files[0]) {
        const reader = new FileReader();

        reader.onload = (function(previewElement) {
          return function(ev: ProgressEvent<FileReader>) {
            if (!!ev.target && typeof ev.target.result == "string") {
              console.log(ev.target);
              previewElement.style.backgroundImage = `url("${ev.target.result}"`;
              previewElement.classList.add("populated");
            } else {
              previewElement.style.backgroundImage = "";
              previewElement.classList.remove("populated");
            }
          };
        })(el);
        reader.readAsDataURL(files[0]);
      } else {
        el.style.backgroundImage = "";
        el.classList.remove("populated");
      }
    },
    resetArt(e: HTMLInputEvent) {
      e.preventDefault();
      const fileInput = document.getElementById(
        "playlist-art"
      ) as HTMLInputElement;
      const preview = document.getElementById(
        "playlist-art-preview"
      ) as HTMLLabelElement;
      fileInput.value = "";
      preview.style.backgroundImage = "";
      preview.classList.remove("populated");
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
    input[type="text"] {
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: 1.25rem;
      margin-top: 0.5rem;

      &:focus ~ span,
      &:focus-within ~ span {
        display: block;
      }
    }
    label {
      display: block;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    span {
      display: none;
      font-size: 0.8rem;
      text-align: right;
      margin-top: 0.75rem;
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
          label {
            .la-toggle-off {
              display: block;
            }
            .la-toggle-on {
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
