<template>
  <div class="footer" v-show="$route.name !== 'Callback'">
    <div class="footer-content">
      <div class="brand">
        <div class="logo">
          <img src="@/img/logo.svg" alt="Curator" />
        </div>
        <h3>Curator</h3>
      </div>
      <div class="sections">
        <div class="section">
          <h6>About</h6>
          <p>
            build {{ buildDate }} by
            <a href="//jared.gq" target="_blank" rel="noopener">
              <strong>Jared Dantis</strong>
            </a>
          </p>
          <a
            href="//github.com/jareddantis/curator"
            target="_blank"
            rel="noopener"
            standalone
            >GitHub repository <i class="las la-external-link-alt"></i
          ></a>
          <a href="//google.com" target="_blank" rel="noopener" standalone
            >Send feedback <i class="las la-external-link-alt"></i
          ></a>
        </div>
        <div class="section">
          <h6>Donate</h6>
          <a
            href="//paypal.me/jareddantis"
            target="_blank"
            rel="noopener"
            standalone
            >PayPal <i class="las la-external-link-alt"></i
          ></a>
          <a href="//ko-fi.com/dantis" target="_blank" rel="noopener" standalone
            >Ko-fi <i class="las la-external-link-alt"></i
          ></a>
          <p>
            Usage of this app is free and is powered by freely available
            technologies, but if you like my work, you can show your support
            through the channels above. Thank you &lt;3
          </p>
        </div>
        <div class="section">
          <h6>Disclaimer &amp; Privacy</h6>
          <p>
            All actions you perform through this app are solely between your
            device & Spotify. None of your data is transferred anywhere else.
          </p>
          <p>
            We don’t use cookies, but we do store information needed to manage
            your playlists. All of this information is stored on your device
            only.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
  data() {
    return {
      buildDate: process.env.BUILD_DATE
    };
  }
});
</script>

<style scoped lang="scss">
.footer {
  background: #232323;
  color: #fff;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  .footer-content {
    max-width: 768px;
    width: 100%;
  }
}
.brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .logo {
    background: white;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  h3 {
    margin: 0 1rem;
  }
}
.sections {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 2rem;

  .section {
    h6 {
      text-transform: uppercase;
      font-weight: bolder;
      margin-bottom: 1rem;
    }
    a {
      color: white;
      font-weight: bolder;
      text-decoration: none;
      margin: 0.5rem 0;

      &[standalone] {
        display: block;
      }
      &:hover {
        color: #aaa;
      }
    }
    p {
      font-size: 0.8rem;
    }
  }
}

@media screen and (max-width: 800px) {
  .sections {
    grid-template-columns: 1fr;
  }
}
@media screen and (max-width: 480px) {
  .footer {
    padding: 1.5rem;
  }
}
</style>
