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
        route="/create"
      />
      <Tool icon="la la-trash" name="Delete playlists" route="/create" />
      <Tool icon="la la-random" name="Randomize tracks" route="/create" />
      <Tool icon="la la-plus" name="Add tracks" route="/add-tracks" />
      <Tool
        icon="la la-filter"
        name="Prune playlists"
        description="Remove artists & albums"
        route="/create"
      />
      <Tool icon="la la-arrows-alt" name="Move tracks" route="/create" />
      <Tool icon="la la-search" name="Search in playlists" route="/create" />
      <Tool
        icon="la la-cloud-download-alt"
        name="Backup playlists"
        route="/create"
      />
      <Tool
        icon="la la-cloud-upload-alt"
        name="Restore backup"
        route="/create"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import Tool from "@/components/Tool.vue";
import useToolsTask from "@/api/composables/ToolsTask";
import { mapState, useStore } from "vuex";

export default defineComponent({
  name: "Tools",
  components: {
    Header,
    Tool
  },
  computed: mapState(["id"]),
  data() {
    return {
      playlistCount: "0",
      trackCount: "0"
    };
  },
  mounted() {
    this.store
      .dispatch("getUpdatedToken")
      .then(token => this.task.perform(token, this.id))
      .then(({ playlists, tracks }) => {
        this.playlistCount = playlists;
        this.trackCount = tracks;
      }).then;
  },
  setup() {
    return {
      store: useStore(),
      task: useToolsTask()
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
</style>
