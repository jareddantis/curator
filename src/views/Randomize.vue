<template>
  <div class="view-body">
    <Header border ref="header">
      <template v-slot:default>Randomize {{ name }}</template>
      <template v-slot:subtitle>
        {{ tracks.length }} track{{ tracks.length > 1 ? "s" : "" }}
        total
      </template>
    </Header>
    <div class="playlist">
      <div class="tracks">
        <MediaEntity
          previewable
          v-for="track in tracks"
          :key="track.id"
          :name="track.name"
          :image="track.album.images[0]?.url"
          :explicit="track.explicit"
          :preview-url="track.preview_url"
        >
          <strong>{{ formatDuration(track.duration_ms) }}</strong> &bull;
          {{ track.artists[0].name }} &bull; {{ track.album.name }} ({{
            track.album.release_date.split("-")[0]
          }})
        </MediaEntity>
      </div>
    </div>
    <p class="jump-link" @click="backToTop">
      Back to top <i class="la la-arrow-up"></i>
    </p>
    <div class="view-action" v-show="tracks.length">
      <div class="view-action-content">
        <RoundButton transparent @click="shuffle">
          Randomize
        </RoundButton>
        <RoundButton>
          Save
        </RoundButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import { Track } from "spotify-web-api-ts/types/types/SpotifyObjects";
import { formatDuration } from "@/api/helpers";
import getPlaylist from "@/api/composables/GetPlaylist";
import getPlaylistItems from "@/api/composables/GetPlaylistItems";
import Header from "@/components/standalone/Header.vue";
import MediaEntity from "@/components/standalone/MediaEntity.vue";
import RoundButton from "@/components/base/RoundButton.vue";

export default defineComponent({
  name: "Randomize",
  components: {
    Header,
    MediaEntity,
    RoundButton
  },
  computed: mapState(["target"]),
  data() {
    return {
      name: "...",
      tracks: [] as Track[]
    };
  },
  methods: {
    backToTop() {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    },
    async getPlaylistName(token: string) {
      const { name } = await this.getPlaylistTask.perform(
        token,
        this.target[0]
      );
      this.name = name;
      return token;
    },
    async getPlaylistTracks(token: string) {
      this.tracks = await this.getTracksTask.perform(token, this.target[0]);
      return;
    },
    shuffle() {
      for (let i = this.tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = this.tracks[i];
        this.tracks[i] = this.tracks[j];
        this.tracks[j] = temp;
      }
    }
  },
  mounted() {
    this.store
      .dispatch("getUpdatedToken")
      .then(token => this.getPlaylistName(token))
      .then(token => this.getPlaylistTracks(token));
  },
  setup() {
    return {
      formatDuration,
      store: useStore(),
      getPlaylistTask: getPlaylist(),
      getTracksTask: getPlaylistItems()
    };
  }
});
</script>

<style scoped></style>
