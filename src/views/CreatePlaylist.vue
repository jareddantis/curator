<template>
  <div class="view-body">
    <Header>
      <template v-slot:default>Create playlist</template>
    </Header>
    <PlaylistForm is-new-playlist @submit="submit" :disabled="task.isRunning" />
    <Modal loading :visible="task.isRunning">Creating playlist</Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import Header from "@/components/standalone/Header.vue";
import Modal from "@/components/base/Modal.vue";
import PlaylistForm from "@/components/standalone/PlaylistForm.vue";
import createPlaylist from "@/api/composables/CreatePlaylist";

export default defineComponent({
  name: "CreatePlaylist",
  components: {
    Header,
    Modal,
    PlaylistForm
  },
  computed: mapState(["id"]),
  data() {
    return {
      loading: false
    };
  },
  setup() {
    return {
      store: useStore(),
      task: createPlaylist()
    };
  },
  methods: {
    submit(details: PlaylistDetails) {
      const {
        name,
        collaborative,
        isPublic,
        description,
        art,
        populate
      } = details;
      if (name.length) {
        this.store
          .dispatch("getUpdatedToken")
          .then(token =>
            this.task.perform(this.id, token, {
              name,
              collaborative,
              isPublic,
              description,
              art
            })
          )
          .then((id: string) => {
            if (populate) {
              this.store.commit("setTarget", [id]);
              this.$router.replace("/add-tracks");
            } else {
              this.$router.push("/");
            }
          });
      } else {
        window.alert("Please specify a playlist name.");
      }
    }
  }
});
</script>
