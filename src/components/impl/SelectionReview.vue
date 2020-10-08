<template>
  <BottomSheet :visible="visible" ref="root">
    <template v-slot:title>Review queue</template>
    <template v-slot:subtitle>
      Tap a track to remove from your queue.
    </template>
    <template v-slot:content>
      <MediaEntity
        small
        v-for="track in localCart"
        :key="track.id"
        :name="track.name"
        :image="track.album.images[0]?.url"
        :explicit="track.explicit"
        :selected="selection.includes(track.id)"
        @click="clickHandler(track.id)"
      >
        {{ track.artists[0].name }} &bull; {{ track.album.name }} ({{
          track.album.release_date.split("-")[0]
        }})
      </MediaEntity>
    </template>
    <template v-slot:actions-caption v-if="selection.length">
      {{ selection.length }} track{{ selection.length !== 1 ? "s" : "" }}
      selected
    </template>
    <template v-slot:actions-caption v-else>
      {{ localCart.length }} track{{ localCart.length !== 1 ? "s" : "" }} in
      queue
    </template>
    <template v-slot:actions>
      <RoundButton
        full-width
        transparent
        @click="selectAll"
        :disabled="selection.length === localCart.length || disabled"
      >
        Select All
      </RoundButton>
      <RoundButton
        full-width
        transparent
        @click="deselectAll"
        :disabled="!selection.length || disabled"
      >
        Deselect All
      </RoundButton>
      <RoundButton
        full-width
        @click="removeSelection"
        :disabled="disabled"
        v-if="selection.length"
      >
        Dequeue
      </RoundButton>
      <RoundButton
        full-width
        @click="proceed"
        :disabled="!cart.length || disabled"
        v-else
      >
        Confirm
      </RoundButton>
    </template>
  </BottomSheet>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomSheet from "@/components/base/BottomSheet.vue";
import RoundButton from "@/components/base/RoundButton.vue";
import MediaEntity from "@/components/standalone/MediaEntity.vue";
import { SimplifiedTrack } from "spotify-web-api-ts/types/types/SpotifyObjects";

export default defineComponent({
  name: "SelectionReview",
  components: {
    MediaEntity,
    BottomSheet,
    RoundButton
  },
  data() {
    return {
      localCart: [] as SimplifiedTrack[],
      selection: [] as string[]
    };
  },
  emits: ["confirm", "remove"],
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
    removeSelection() {
      this.$emit("remove", this.selection);
      this.deselectAll();
    },
    selectAll() {
      this.localCart.forEach((track: SimplifiedTrack) => {
        if (!this.selection.includes(track.id)) {
          this.selection.push(track.id);
        }
      });
    },
    proceed() {
      const rootSheet = this.$refs.root as typeof BottomSheet;
      rootSheet.close();
      this.$emit("confirm");
    }
  },
  mounted() {
    this.localCart = this.cart;
  },
  props: {
    cart: {
      default: [] as SimplifiedTrack[],
      required: true
    },
    disabled: Boolean,
    visible: Boolean
  },
  watch: {
    cart(newCart: SimplifiedTrack[]) {
      this.localCart = newCart;
    }
  }
});
</script>

<style scoped></style>
