<template>
  <div class="home">
    <template v-if="accessToken">
      <NowPlaying />
      <info :dialog="dialog" @close="dialog = false" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab-mini
          icon="help_outline"
          color="accent"
          @click="dialog = true"
        />
      </q-page-sticky>
    </template>

    <div v-else class="row items-center fullscreen">
      <div class="col text-center">
        <q-btn
          @click="authorize()"
          align="between"
          class="btn-fixed-width"
          color="positive"
          label="Authorize with Spotify"
          icon="lock"
          :loading="authing"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NowPlaying from "@/components/NowPlaying.vue";
import Info from "@/components/Misc/Info.vue";
import { NegotiateTokenInfo, GetTokenInfo } from "@/services/auth.js";
import { mapMutations } from "vuex";

export default {
  name: "home",
  components: {
    NowPlaying,
    Info
  },
  data() {
    return {
      authing: false,
      accessToken: null,
      dialog: false
    };
  },
  methods: {
    ...mapMutations(["setAccessToken"]),
    hideDialog() {},
    authorize() {
      this.authing = true;
      let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=400,height=600,left=100,top=100`;
      var w = window.open(
        `https://accounts.spotify.com/authorize?client_id=${process.env.VUE_APP_SPOTIFYCLIENTID}&redirect_uri=${process.env.VUE_APP_REDIRECTURL}&scope=${process.env.VUE_APP_SPOTIFYSCOPE}&response_type=code`,
        "authenticate",
        params
      );

      var intv = setInterval(() => {
        let queryString = w.location.search;
        let params = new URLSearchParams(queryString);
        let code = params.get("code");
        if (code) {
          clearInterval(intv);
          NegotiateTokenInfo(code).then(token => {
            w.close();
            this.authing = false;
            this.accessToken = token;
          });
        }
      }, 250);
    }
  },
  created() {
    GetTokenInfo().then(token => {
      this.accessToken = token;
    });
  }
};
</script>
