<template>
  <div class="tools view-body">
    <Header>
      <template v-slot:default>What would you like to do today?</template>
      <template v-slot:subtitle>
        You've created <strong>{{ playlistCount }} playlists</strong> with a
        total of <strong>{{ trackCount }}</strong> tracks.
      </template>
    </Header>
    <div class="tools-body">
      <Tool icon="la la-file" name="Create playlist" route="/create" />
      <Tool
        icon="la la-pencil-alt"
        name="Edit playlist details"
        description="Name, description, artwork"
        @click="pickPlaylist('edit', 'edit details')"
      />
      <Tool
        icon="la la-trash"
        name="Delete playlists"
        @click="pickPlaylist('delete-playlists', 'delete', true)"
      />
      <Tool
        icon="la la-random"
        name="Randomize tracks"
        @click="pickPlaylist('randomize', 'randomize')"
      />
      <Tool
        icon="la la-plus"
        name="Add tracks"
        @click="pickPlaylist('add-tracks', 'add tracks to')"
      />
      <Tool
        icon="la la-filter"
        name="Prune playlists"
        description="Remove artists & albums"
        @click="pickPlaylist('prune', 'remove tracks from', true)"
      />
      <Tool
        icon="la la-arrows-alt"
        name="Move tracks"
        @click="pickPlaylist('move-tracks', 'move tracks from')"
      />
      <Tool icon="la la-search" name="Search in playlists" route="/search" />
      <Tool
        icon="la la-cloud-download-alt"
        name="Backup playlists"
        @click="pickPlaylist('backup', 'backup')"
      />
      <Tool
        icon="la la-cloud-upload-alt"
        name="Restore backup"
        route="/restore"
      />
    </div>
    <PlaylistPicker
      :action="pickPurpose"
      :visible="willPickPlaylist"
      :plural="willPickMultiple"
      @dismiss="willPickPlaylist = false"
      @playlist-picked="$router.push(`/${nextRoute}`)"
    ></PlaylistPicker>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import Header from "@/components/standalone/Header.vue";
import Tool from "@/components/standalone/Tool.vue";
import PlaylistPicker from "@/components/impl/PlaylistPicker.vue";
import getPlaylists from "@/api/composables/GetPlaylists";

export default defineComponent({
  name: "Tools",
  components: {
    Header,
    Tool,
    PlaylistPicker
  },
  computed: mapState(["id"]),
  data() {
    return {
      nextRoute: "",
      pickPurpose: "",
      playlistCount: "0",
      trackCount: "0",
      willPickPlaylist: false,
      willPickMultiple: false
    };
  },
  methods: {
    pickPlaylist(route: string, action: string, plural = false) {
      this.nextRoute = route;
      this.pickPurpose = action;
      this.willPickMultiple = plural;
      this.willPickPlaylist = true;
    }
  },
  mounted() {
    this.store
      .dispatch("getUpdatedToken")
      .then(token => this.task.perform(token, this.id))
      .then(({ numPlaylists, totalTracks }) => {
        this.playlistCount = numPlaylists;
        this.trackCount = totalTracks;
      }).then;
  },
  setup() {
    return {
      store: useStore(),
      task: getPlaylists()
    };
  }
});
</script>

<style scoped lang="scss">
.tools-body {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 1rem;
}

@media screen and (max-width: 800px) {
  .tools-body {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (max-width: 480px) {
  .tools-body {
    grid-gap: 0.5rem;
  }
}
</style>
