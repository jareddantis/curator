<template>
  <BottomSheet :loading="task.isRunning" :visible="visible" ref="root">
    <template v-slot:title>
      Add tracks from &quot;{{ album.name }}&quot;
    </template>
    <template v-slot:subtitle>
      You can add everything or uncheck the ones you don't want.
    </template>
    <template v-slot:content>
      <MediaEntity
        previewable
        v-for="track in albumTracks"
        :key="track.id"
        :name="track.name"
        :image="album.images[0]?.url"
        :explicit="track.explicit"
        :preview-url="track.preview_url"
        :selected="selection.includes(track.id)"
        @click="clickHandler(track.id)"
      >
        {{ track.artists[0].name }}
      </MediaEntity>
    </template>
    <template v-slot:actions-caption v-if="selection.length">
      {{ selection.length }} track{{ selection.length !== 1 ? "s" : "" }}
      selected
    </template>
    <template v-slot:actions-caption v-else>
      {{ albumTracks.length }} track{{ albumTracks.length !== 1 ? "s" : "" }} in
      queue
    </template>
    <template v-slot:actions>
      <RoundButton
        full-width
        transparent
        @click="selectAll"
        :disabled="selection.length === albumTracks.length || task.isRunning"
      >
        Select All
      </RoundButton>
      <RoundButton
        full-width
        transparent
        @click="deselectAll"
        :disabled="!selection.length || task.isRunning"
      >
        Deselect All
      </RoundButton>
      <RoundButton
        full-width
        @click="proceed"
        :disabled="!selection.length || task.isRunning"
      >
        Confirm
      </RoundButton>
    </template>
  </BottomSheet>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import {
  SimplifiedAlbum,
  SimplifiedTrack
} from "spotify-web-api-ts/types/types/SpotifyObjects";
import MediaEntity from "@/components/standalone/MediaEntity.vue";
import BottomSheet from "@/components/base/BottomSheet.vue";
import RoundButton from "@/components/base/RoundButton.vue";
import getAlbumTracks from "@/api/composables/GetAlbumTracks";
import { AugmentedTrack } from "@/types/addtracks";

export default defineComponent({
  name: "AlbumReview",
  components: {
    MediaEntity,
    BottomSheet,
    RoundButton
  },
  data() {
    return {
      albumTracks: [] as SimplifiedTrack[],
      selection: [] as string[]
    };
  },
  emits: ["confirm"],
  methods: {
    clickHandler(id: string) {
      if (this.selection.includes(id)) {
        const index = this.selection.indexOf(id);
        this.selection.splice(index, 1);
      } else {
        this.selection.push(id);
      }
    },
    deselectAll() {
      this.selection = [];
    },
    selectAll() {
      this.albumTracks.forEach((track: SimplifiedTrack) => {
        if (!this.selection.includes(track.id)) {
          this.selection.push(track.id);
        }
      });
    },
    proceed() {
      const rootSheet = this.$refs.root as typeof BottomSheet;
      const result: AugmentedTrack[] = [];
      this.albumTracks
        .filter((track: SimplifiedTrack) => this.selection.includes(track.id))
        .forEach((track: SimplifiedTrack) => {
          result.push({
            ...track,
            album: this.album as SimplifiedAlbum
          });
        });
      rootSheet.close();
      this.$emit("confirm", result);
    }
  },
  props: {
    album: {
      required: true
    },
    disabled: Boolean,
    visible: Boolean
  },
  setup() {
    return {
      task: getAlbumTracks(),
      store: useStore()
    };
  },
  watch: {
    visible(after) {
      if (after) {
        this.store
          .dispatch("getUpdatedToken")
          .then(token =>
            this.task.perform(token, (this.album as SimplifiedAlbum).id)
          )
          .then(tracks => {
            this.albumTracks = tracks;
            this.selection = tracks.map((track: SimplifiedTrack) => track.id);
          });
      }
    }
  }
});
</script>
