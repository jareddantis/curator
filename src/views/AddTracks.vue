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
      <p class="jump-link" @click="jumpToAlbums">
        Jump to albums <i class="la la-arrow-down"></i>
      </p>
      <div class="track-results">
        <h4>Top matching tracks</h4>
        <h5>Tap to add to queue, hover or hold to preview</h5>
        <MediaEntity
          previewable
          v-for="track in results.tracks"
          :key="track.id"
          :name="track.name"
          :image="track.album.images[0]?.url"
          :explicit="track.explicit"
          :preview-url="track.preview_url"
          :selected="selectionURIs.includes(track.uri)"
          :track-id="track.id"
          @click="trackClickHandler(track)"
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
          @click="showAlbumTracks(album)"
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
    <div class="view-action" v-show="selection.length">
      <div class="view-action-content">
        <p>
          {{ selection.length }} track{{ selection.length > 1 ? "s" : "" }}
          in queue
        </p>
        <RoundButton full-width @click="reviewQueue = true">
          Review Queue
        </RoundButton>
      </div>
    </div>
    <SelectionReview
      :disabled="addTracksTask.isRunning"
      :cart="selection"
      :visible="reviewQueue"
      @confirm="addTracks"
      @dismiss="reviewQueue = false"
      @remove="removeFromQueue"
    />
    <AlbumReview
      :disabled="addTracksTask.isRunning"
      :album="sourceAlbum.raw"
      :visible="sourceAlbum.review"
      @confirm="addFromAlbum"
      @dismiss="sourceAlbum.review = false"
    />
    <Modal loading :visible="addTracksTask.isRunning">
      Adding tracks to playlist
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import { SimplifiedAlbum } from "spotify-web-api-ts/types/types/SpotifyObjects";
import { AugmentedTrack } from "@/types/addtracks";
import { formatDuration } from "@/api/helpers";
import Header from "@/components/standalone/Header.vue";
import SearchBar from "@/components/standalone/SearchBar.vue";
import MediaEntity from "@/components/standalone/MediaEntity.vue";
import Modal from "@/components/base/Modal.vue";
import RoundButton from "@/components/base/RoundButton.vue";
import AlbumReview from "@/components/impl/AlbumReview.vue";
import SelectionReview from "@/components/impl/SelectionReview.vue";
import search from "@/api/composables/Search";
import getPlaylist from "@/api/composables/GetPlaylist";
import addTracks from "@/api/composables/AddTracks";

export default defineComponent({
  name: "AddTracks",
  components: {
    AlbumReview,
    Header,
    MediaEntity,
    Modal,
    RoundButton,
    SearchBar,
    SelectionReview
  },
  computed: mapState(["id", "target"]),
  data() {
    return {
      playlistName: "...",
      selection: [] as AugmentedTrack[],
      selectionURIs: [] as string[],
      sourceAlbum: {
        raw: {} as SimplifiedAlbum,
        review: false
      },
      results: {
        ready: false,
        albums: [] as SimplifiedAlbum[],
        tracks: [] as AugmentedTrack[]
      },
      reviewQueue: false
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
    addFromAlbum(tracks: AugmentedTrack[]) {
      this.selection = this.selection.concat(tracks);
      this.selectionURIs = this.selectionURIs.concat(
        tracks.map((track: AugmentedTrack) => track.uri)
      );
    },
    addTracks() {
      this.store
        .dispatch("getUpdatedToken")
        .then(token =>
          this.addTracksTask.perform(token, this.target[0], this.selection)
        )
        .then(() => this.$router.push("/"))
        .catch(e => window.alert(e));
    },
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
    jumpToAlbums() {
      const albumResults = this.$refs.albums as HTMLDivElement;
      const offset = albumResults.offsetTop - window.innerHeight / 3;
      window.scrollTo({ left: 0, top: offset, behavior: "smooth" });
    },
    removeFromQueue(ids: string[]) {
      ids.forEach((id: string) => {
        const uri = `spotify:track:${id}`;
        if (this.selectionURIs.includes(uri)) {
          const index = this.selectionURIs.indexOf(uri);
          this.selection.splice(index, 1);
          this.selectionURIs.splice(index, 1);
        }
      });
    },
    showAlbumTracks(album: SimplifiedAlbum) {
      this.sourceAlbum.raw = album;
      this.sourceAlbum.review = true;
    },
    trackClickHandler(track: AugmentedTrack) {
      const uri = `spotify:track:${track.id}`;
      if (this.selectionURIs.includes(uri)) {
        const index = this.selectionURIs.indexOf(uri);
        this.selection.splice(index, 1);
        this.selectionURIs.splice(index, 1);
      } else {
        this.selection.push(track);
        this.selectionURIs.push(uri);
      }
    }
  },
  setup() {
    return {
      addTracksTask: addTracks(),
      formatDuration,
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
  h4,
  h5 {
    margin-top: 0;
    font-weight: 500;
    color: #555;
  }
  h4 {
    margin-bottom: 0.5rem;
  }
}
</style>
