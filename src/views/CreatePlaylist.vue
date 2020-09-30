<template>
  <div class="create-playlist">
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
      </div>
      <div class="field">
        <label for="playlist-desc">Description</label>
        <input
          type="text"
          id="playlist-desc"
          maxlength="300"
          v-model="playlistDesc"
        />
      </div>
      <div class="field level">
        <div class="left">
          <label for="playlist-art">Artwork</label>
          <p>Please ensure that you hold rights over the artwork you choose.</p>
        </div>
        <div class="right">
          <input type="file" id="playlist-art" />
        </div>
      </div>
      <div class="field level">
        <div class="left">
          <label for="playlist-privacy">Make this playlist public</label>
          <p>Will be visible on your Spotify profile</p>
        </div>
        <div class="right checkbox">
          <input
            type="checkbox"
            id="playlist-privacy"
            v-model="playlistPrivacy"
          />
          <label for="playlist-privacy" class="fake-checkbox">
            <i class="la la-toggle-on"></i>
            <i class="la la-toggle-off"></i>
          </label>
        </div>
      </div>
      <div class="field level">
        <div class="left">
          <label for="playlist-perms">Allow collaboration</label>
          <p>Other people will be able to edit</p>
        </div>
        <div class="right checkbox">
          <input type="checkbox" id="playlist-perms" v-model="playlistPerms" />
          <label for="playlist-perms" class="fake-checkbox">
            <i class="la la-toggle-on"></i>
            <i class="la la-toggle-off"></i>
          </label>
        </div>
      </div>
      <div class="field level">
        <div class="left">
          <label for="playlist-populate">Add tracks now</label>
          <p>You can always do this later</p>
        </div>
        <div class="right checkbox">
          <input
            type="checkbox"
            id="playlist-populate"
            v-model="playlistPopulate"
          />
          <label for="playlist-populate" class="fake-checkbox">
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
      playlistPopulate: false
    };
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

      .left {
        grid-area: left;

        p {
          margin: 0;
          font-size: 0.9rem;
        }
      }
      .right {
        grid-area: right;
        text-align: right;

        &.checkbox {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .fake-checkbox {
            font-size: 2.5rem;
            cursor: pointer;

            .la-toggle-off {
              display: block;
            }
            .la-toggle-on {
              display: none;
            }
          }
          input[type="checkbox"] {
            position: absolute;
            left: -999999rem;

            &:checked ~ .fake-checkbox .la-toggle-on {
              display: block;
            }
            &:checked ~ .fake-checkbox .la-toggle-off {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
