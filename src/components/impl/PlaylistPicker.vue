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
      <MediaEntity
        v-for="playlist in playlists"
        :key="playlist.id"
        :name="playlist.name"
        :selected="selectedPlaylists.includes(playlist.id)"
        :image="playlist.images[0]?.url"
        @click="playlistClickHandler(playlist.id)"
      >
        {{ playlist.tracks.total }} track{{
          playlist.tracks.total !== 1 ? "s" : ""
        }}
      </MediaEntity>
    </template>
    <template v-slot:actions-caption>
      {{ selectedPlaylists.length }} playlist{{
        selectedPlaylists.length !== 1 ? "s" : ""
      }}
      selected
    </template>
    <template v-slot:actions>
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
    </template>
  </BottomSheet>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomSheet from "@/components/base/BottomSheet.vue";
import RoundButton from "@/components/base/RoundButton.vue";
import getPlaylists from "@/api/composables/GetPlaylists";
import { mapState, useStore } from "vuex";
import { SimplifiedPlaylist } from "spotify-web-api-ts/types/types/SpotifyObjects";
import MediaEntity from "@/components/standalone/MediaEntity.vue";

export default defineComponent({
  name: "PlaylistPicker",
  components: {
    MediaEntity,
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
    close(result: string[]) {
      const rootSheet = this.$refs.root as typeof BottomSheet;
      rootSheet.close();
      this.store.commit("setTarget", result);
      this.$emit("playlist-picked");
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
        this.close([id]);
      }
    },
    selectAll() {
      this.playlists.forEach((playlist: SimplifiedPlaylist) => {
        if (!this.selectedPlaylists.includes(playlist.id)) {
          this.selectedPlaylists.push(playlist.id);
        }
      });
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
      task: getPlaylists()
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
