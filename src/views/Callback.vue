<template>
  <div class="callback">
    <div class="callback-content">
      <img src="/img/logo.svg" alt="Curator" />
      <h3>{{ status }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import { serialize } from "@/api/spotify-auth";
import Axios from "axios";

export default defineComponent({
  name: "Callback",
  computed: mapState(["stateToken", "codeVerifier"]),
  data() {
    return {
      status: "Talking to Spotify"
    };
  },
  setup() {
    return {
      store: useStore()
    };
  },
  async created() {
    const { state } = this.$route.query;

    // Check if state is the same
    if (this.stateToken === state) {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, "code")) {
        try {
          // Request access token
          const { access_token, refresh_token } = (
            await Axios.post(
              "https://accounts.spotify.com/api/token",
              serialize({
                client_id: process.env.VUE_APP_CLIENT_ID,
                grant_type: "authorization_code",
                code: this.$route.query.code as string,
                redirect_uri: `${process.env.VUE_APP_URL}/callback`,
                code_verifier: this.codeVerifier
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              }
            )
          ).data;
          // Get user info
          const { country, id } = (
            await Axios.get("https://api.spotify.com/v1/me", {
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            })
          ).data;

          if (!!access_token && !!refresh_token && !!country && !!id) {
            if (window.opener) {
              window.opener.postMessage({
                type: "curator",
                accessToken: access_token,
                refreshToken: refresh_token,
                userCountry: country,
                userID: id
              });
              window.close();
            } else {
              this.status = "Error: Lost connection to parent window";
            }
          } else {
            this.status = "Failed to obtain tokens from Spotify";
          }
        } catch (err) {
          this.status = `Error: ${err}`;
        }
      } else if (
        Object.prototype.hasOwnProperty.call(this.$route.query, "error")
      ) {
        this.status = `Error authenticating with Spotify: ${this.$route.query.error}`;
      }
    } else {
      this.status = "State mismatch! Is <code>localStorage</code> enabled?";
    }
  }
});
</script>

<style scoped lang="scss">
.callback {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &-content {
    text-align: center;
    img {
      height: 4rem;
    }
  }
}
</style>
