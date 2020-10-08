<template>
  <div class="intro">
    <div class="hero"></div>
    <div class="cta">
      <h1>Welcome to Curator,<br />the playlist manager</h1>
      <RoundButton @click="login">Sign in with Spotify</RoundButton>
    </div>
    <div class="features">
      <div class="features-content">
        <div class="feature">
          <i class="la la-file"></i>
          <h2>Make playlists</h2>
          <p>Add your favorite songs, artists, and albums<br />all in one go</p>
        </div>
        <div class="feature">
          <i class="la la-random"></i>
          <h2>Randomize tracks</h2>
          <p>
            For when it feels like putting it on shuffle<br />isn't random
            enough
          </p>
        </div>
        <div class="feature">
          <i class="la la-cloud"></i>
          <h2>Backup and restore</h2>
          <p>
            In case you decide you actually like<br />that one song you deleted
          </p>
        </div>
        <div class="feature">
          <i class="la la-grin-wink"></i>
          <h2>And much more</h2>
          <p>
            All in one interface that's easy to use,<br />even on your phone
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import RoundButton from "@/components/base/RoundButton.vue";
import { generatePKCE } from "@/api/spotify-auth";

export default defineComponent({
  name: "Intro",
  components: {
    RoundButton
  },
  setup() {
    return {
      store: useStore()
    };
  },
  methods: {
    login() {
      generatePKCE().then(({ authURL, codeVerifier, state }) => {
        const windowName = "Sign in to Curator";
        const features =
          "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

        this.store.commit("setStateToken", state);
        this.store.commit("setVerifier", codeVerifier);
        window.removeEventListener("message", this.authListener);
        window.open(authURL, windowName, features)?.focus();
        window.addEventListener(
          "message",
          event => this.authListener(event),
          false
        );
      });
    },
    authListener(event: MessageEvent) {
      if (event.data?.type == "curator") {
        const { accessToken, refreshToken, expiry } = event.data;
        this.store.commit("setAccessToken", accessToken);
        this.store.commit("setExpiry", expiry);
        this.store.commit("setRefreshToken", refreshToken);
        this.store.commit("setStateToken", "");
        this.store.commit("setVerifier", "");
      }
    }
  }
});
</script>

<style scoped lang="scss">
.hero {
  width: 100%;
  height: 100vh;
  background: url("../../img/intro.svg") no-repeat right top;
}
.cta {
  position: absolute;
  top: 50%;
  left: 5rem;
  transform: translateY(-50%);

  h1 {
    font-size: 2.5rem;
    margin-top: 0;
  }
}
.features {
  padding: 2rem;
  background: #f1f1f1;

  .features-content {
    margin: 0 auto;
    max-width: 768px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-row-gap: 2rem;
    grid-column-gap: 2rem;
  }

  i.la {
    font-size: 2rem;
  }
}

@media screen and (max-width: 800px) {
  .hero {
    height: unset;
    padding-bottom: 100%;
  }
  .cta {
    position: relative;
    bottom: unset;
    top: unset;
    left: unset;
    width: 100%;
    background: white;
    padding: 2rem;
    transform: none;

    h1 {
      font-size: 1.75rem;
    }
  }
  .features .features-content {
    grid-template-columns: 1fr;
    grid-row-gap: 2rem;
  }
}
</style>
