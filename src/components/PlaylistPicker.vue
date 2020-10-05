<template>
  <BottomSheet
    :loading="task.isRunning"
    :visible="visible"
    ref="root"
    :no-actions="!plural"
  >
    <template v-slot:title>Which playlist{{ plural ? "s" : "" }}?</template>
    <template v-slot:subtitle>
      Pick one {{ plural ? "or more playlists" : "playlist" }} to {{ action }}.
    </template>
    <template v-slot:content>
      <div class="playlists">
        <div
          class="playlist"
          v-for="playlist in playlists"
          :key="playlist.id"
          :selected="selectedPlaylists.includes(playlist.id)"
          @click="playlistClickHandler(playlist.id)"
        >
          <div class="playlist-art">
            <div class="selected">
              <i class="la la-check"></i>
            </div>
            <img :src="playlist.images[0].url" :alt="playlist.name" />
          </div>
          <div class="playlist-info">
            <div class="playlist-info-content">
              <h3>{{ playlist.name }}</h3>
              <p>
                {{ playlist.tracks.total }} track{{
                  playlist.tracks.total !== 1 ? "s" : ""
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:bottom>
      <div class="proceed">
        <p>
          {{ selectedPlaylists.length }} playlist{{
            selectedPlaylists.length !== 1 ? "s" : ""
          }}
          selected
        </p>
        <div class="actions">
          <RoundButton
            full-width
            transparent
            @click="selectAll"
            :disabled="
              selectedPlaylists.length === playlists.length || task.isRunning
            "
          >
            Select All
          </RoundButton>
          <RoundButton
            full-width
            transparent
            @click="deselectAll"
            :disabled="!selectedPlaylists.length || task.isRunning"
          >
            Deselect All
          </RoundButton>
          <RoundButton
            full-width
            @click="submitMultiple"
            :disabled="!selectedPlaylists.length || task.isRunning"
          >
            Proceed
          </RoundButton>
        </div>
      </div>
    </template>
  </BottomSheet>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomSheet from "@/components/BottomSheet.vue";
import RoundButton from "@/components/RoundButton.vue";
import getPlaylistsTask from "@/api/composables/GetPlaylistsTask";
import { mapState, useStore } from "vuex";
import { SimplifiedPlaylist } from "spotify-web-api-ts/types/types/SpotifyObjects";

export default defineComponent({
  name: "PlaylistPicker",
  components: {
    BottomSheet,
    RoundButton
  },
  computed: mapState(["id"]),
  data() {
    return {
      selectedPlaylists: [] as string[],
      playlists: [] as SimplifiedPlaylist[]
    };
  },
  methods: {
    close(result: string | string[]) {
      const rootSheet = this.$refs.root as typeof BottomSheet;
      rootSheet.close();
      this.$emit("playlist-picked", result);
    },
    deselectAll() {
      this.selectedPlaylists = [];
    },
    playlistClickHandler(id: string) {
      if (this.plural) {
        if (this.selectedPlaylists.includes(id)) {
          const index = this.selectedPlaylists.indexOf(id);
          this.selectedPlaylists.splice(index, 1);
        } else {
          this.selectedPlaylists.push(id);
        }
      } else {
        this.close(id);
      }
    },
    selectAll() {
      this.playlists.forEach((playlist: SimplifiedPlaylist) =>
        this.selectedPlaylists.push(playlist.id)
      );
    },
    submitMultiple() {
      this.close(this.selectedPlaylists);
    }
  },
  props: {
    action: {
      type: String,
      required: true
    },
    plural: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    return {
      store: useStore(),
      task: getPlaylistsTask()
    };
  },
  watch: {
    visible(after) {
      if (after) {
        this.deselectAll();
        this.store
          .dispatch("getUpdatedToken")
          .then(token => this.task.perform(token, this.id))
          .then(({ playlists }) => (this.playlists = playlists));
      }
    }
  }
});
</script>

<style scoped lang="scss">
.playlist {
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
    .playlist-art .selected {
      display: flex;
    }
    .playlist-info-content {
      color: #bf0000;
    }
  }
  .playlist-art {
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
  .playlist-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .playlist-info-content {
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

.proceed {
  p {
    margin-top: 0;
  }
  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 1rem;
  }
}
</style>
