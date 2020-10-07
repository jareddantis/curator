<template>
  <div class="view-body">
    <Header :border="results.ready">
      <template v-slot:default
        >Add tracks for &quot;{{ playlistName }}&quot;</template
      >
      <template v-slot:subtitle>Enter a song or an album name.</template>
      <template v-slot:body>
        <SearchBar id="track-search" @search="doSearch" ref="searchbar" />
      </template>
    </Header>
    <div class="search-results" v-show="results.ready">
      <p class="jump" @click="jumpToAlbums">
        Jump to albums <i class="la la-arrow-down"></i>
      </p>
      <div class="track-results">
        <h4>Top matching tracks (hover or hold to preview)</h4>
        <MediaEntity
          small
          v-for="track in results.tracks"
          :key="track.id"
          :name="track.name"
          :image="track.album.images[0]?.url"
          :explicit="track.explicit"
          :preview-url="track.preview_url"
          previewable
        >
          <strong>{{ formatDuration(track.duration_ms) }}</strong> &bull;
          {{ track.artists[0].name }} &bull; {{ track.album.name }} ({{
            track.album.release_date.split("-")[0]
          }})
        </MediaEntity>
      </div>
      <div class="album-results" ref="albums">
        <h4>Top matching albums</h4>
        <MediaEntity
          v-for="album in results.albums"
          :key="album.id"
          :name="album.name"
          :image="album.images[0]?.url"
          :tag="album.album_type"
          small
        >
          {{ album.artists[0].name }} &bull;
          {{ album.release_date.split("-")[0] }}
          <span v-show="album.album_type !== 'single'">
            &bull; {{ album.total_tracks }} track{{
              album.total_tracks !== 1 ? "s" : ""
            }}
          </span>
        </MediaEntity>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import SearchBar from "@/components/SearchBar.vue";
import search from "@/api/composables/Search";
import { mapState, useStore } from "vuex";
import getPlaylist from "@/api/composables/GetPlaylist";
import {
  SimplifiedAlbum,
  SimplifiedTrack
} from "spotify-web-api-ts/types/types/SpotifyObjects";
import MediaEntity from "@/components/MediaEntity.vue";

export default defineComponent({
  name: "AddTracks",
  components: {
    Header,
    SearchBar,
    MediaEntity
  },
  computed: mapState(["id", "target"]),
  data() {
    return {
      playlistName: "...",
      selection: [],
      results: {
        ready: false,
        albums: [] as SimplifiedAlbum[],
        tracks: [] as SimplifiedTrack[]
      }
    };
  },
  mounted() {
    if (!this.target[0]) {
      window.alert("No playlist selected.");
      this.$router.push("/");
      return;
    }
    this.store
      .dispatch("getUpdatedToken")
      .then(token => this.getPlaylistTask.perform(token, this.target[0]))
      .then(({ name, owner }) => {
        if (owner.id !== this.id) {
          window.alert(
            `Sorry, it looks like you do not own the playlist ${name}.`
          );
          this.$router.push("/");
          return;
        }
        this.playlistName = name;
        (this.$refs.searchbar as typeof SearchBar).focus();
      });
  },
  methods: {
    doSearch(query: string) {
      if (query.length) {
        this.results.ready = false;
        this.store
          .dispatch("getUpdatedToken")
          .then(token => this.searchTask.perform(token, query))
          .then(({ albums, tracks }) => {
            this.results.albums = albums;
            this.results.tracks = tracks;
            this.results.ready = true;
          })
          .catch(e => {
            if (e !== "cancel") {
              this.results.ready = false;
              window.alert(
                `Error while searching: ${e}. Please file a bug report.`
              );
            }
          });
      }
    },
    formatDuration(inMs: number) {
      const secs = Math.ceil(inMs / 1000);
      let secRemainder: number | string = secs % 60;
      if (secRemainder < 10) {
        secRemainder = `0${secRemainder}`;
      }
      return `${Math.floor(secs / 60)}:${secRemainder}`;
    },
    jumpToAlbums() {
      const albumResults = this.$refs.albums as HTMLDivElement;
      const offset = albumResults.offsetTop - window.innerHeight / 3;
      window.scrollTo({ left: 0, top: offset, behavior: "smooth" });
    }
  },
  setup() {
    return {
      getPlaylistTask: getPlaylist(),
      searchTask: search(),
      store: useStore()
    };
  }
});
</script>

<style scoped lang="scss">
.search-results {
  .album-results {
    margin-top: 3rem;
  }
  h4 {
    margin-top: 0;
    font-weight: 500;
    color: #555;
    font-size: 0.875rem;
  }
  .jump {
    text-align: right;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
