<template>
  <div class="view-body">
    <Header border>
      <template v-slot:default>Add tracks</template>
      <template v-slot:subtitle>Enter a song, an album, or an artist</template>
      <template v-slot:body>
        <SearchBar id="track-search" @search="logSearch" />
      </template>
    </Header>
    <div class="search-results">
      <div class="result-header">
        <p>Showing top ten matches</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import SearchBar from "@/components/SearchBar.vue";

export default defineComponent({
  name: "AddTracks",
  components: {
    Header,
    SearchBar
  },
  props: {
    id: String
  },
  methods: {
    logSearch(payload: string) {
      console.log(payload);
    }
  }
});
</script>

<style scoped lang="scss"></style>
