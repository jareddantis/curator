<template>
  <div class="view-body">
    <Header>
      <template v-slot:default>Edit {{ original.name }}</template>
    </Header>
    <PlaylistForm
      @submit="submit"
      :orig-collab="original.collaborative"
      :orig-desc="original.description"
      :orig-name="original.name"
      :orig-public="original.public"
    />
    <Modal loading :visible="editTask.isRunning">Creating playlist</Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import { Playlist } from "spotify-web-api-ts/types/types/SpotifyObjects";
import Header from "@/components/standalone/Header.vue";
import Modal from "@/components/base/Modal.vue";
import PlaylistForm from "@/components/standalone/PlaylistForm.vue";
import editPlaylistDetails from "@/api/composables/EditPlaylistDetails";
import getPlaylist from "@/api/composables/GetPlaylist";

export default defineComponent({
  name: "EditPlaylistDetails",
  components: {
    Header,
    Modal,
    PlaylistForm
  },
  computed: mapState(["target"]),
  data() {
    return {
      original: {} as PlaylistDetails
    };
  },
  methods: {
    submit(details: PlaylistDetails) {
      const { name, collaborative, isPublic, description, art } = details;
      if (name.length) {
        this.store
          .dispatch("getUpdatedToken")
          .then(token =>
            this.editTask.perform(token, this.target[0], {
              name,
              collaborative,
              isPublic,
              description,
              art
            })
          )
          .then(() => this.$router.push("/"));
      } else {
        window.alert("Please specify a playlist name.");
      }
    }
  },
  mounted() {
    this.store
      .dispatch("getUpdatedToken")
      .then(token => this.getOrigTask.perform(token, this.target[0]))
      .then((details: Playlist) => {
        const { collaborative, description, name } = details;
        this.original.collaborative = collaborative;
        this.original.description = description || "";
        this.original.name = name;
        this.original.public = details.public || false;
      });
  },
  setup() {
    return {
      store: useStore(),
      getOrigTask: getPlaylist(),
      editTask: editPlaylistDetails()
    };
  }
});
</script>
