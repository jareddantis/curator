<template>
  <div class="view-body">
    <Header border>
      <template v-slot:default
        >Add tracks for &quot;{{ playlistName }}&quot;</template
      >
      <template v-slot:subtitle>Enter a song, an album, or an artist</template>
      <template v-slot:body>
        <SearchBar id="track-search" @search="doSearch" ref="searchbar" />
      </template>
    </Header>
    <div class="search-results" v-show="results.ready">
      <div class="result-header">
        <div class="track-results">
          <h5>Top ten matching tracks</h5>
          <p v-for="track in results.tracks" :key="track.id">
            {{ track.name }}
          </p>
        </div>
        <div class="artist-results">
          <h5>Top ten matching artists</h5>
          <p v-for="artist in results.artists" :key="artist.id">
            {{ artist.name }}
          </p>
        </div>
        <div class="album-results">
          <h5>Top ten matching albums</h5>
          <p v-for="album in results.albums" :key="album.id">
            {{ album.name }}
          </p>
        </div>
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
  SimplifiedArtist,
  SimplifiedTrack
} from "spotify-web-api-ts/types/types/SpotifyObjects";

export default defineComponent({
  name: "AddTracks",
  components: {
    Header,
    SearchBar
  },
  computed: mapState(["id", "target"]),
  data() {
    return {
      playlistName: "...",
      selection: [],
      results: {
        ready: false,
        artists: [] as SimplifiedArtist[],
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
          console.log(owner.id);
          console.log(this.id);
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
      this.results.ready = false;
      this.store
        .dispatch("getUpdatedToken")
        .then(token => this.searchTask.perform(token, query))
        .then(({ artists, albums, tracks }) => {
          this.results.artists = artists;
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
  setup() {
    return {
      getPlaylistTask: getPlaylist(),
      searchTask: search(),
      store: useStore()
    };
  }
});
</script>

<style scoped lang="scss"></style>
