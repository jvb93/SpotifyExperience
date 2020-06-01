<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-btn @click="authorize()" label="auth" />
      <now-playing />
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
import NowPlaying from "@/components/NowPlaying";
export default {
  name: "LayoutDefault",

  components: { NowPlaying },

  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setAccessToken"]),
    authorize() {
      window.open(
        `https://accounts.spotify.com/authorize?client_id=${process.env.VUE_APP_SPOTIFYCLIENTID}&redirect_uri=${process.env.VUE_APP_REDIRECTURL}&scope=${process.env.VUE_APP_SPOTIFYSCOPE}&response_type=code&state=123`
      );
    }
  },
  created() {
    let uri = window.location.search;
    let params = new URLSearchParams(uri);
    var code = params.get("code");

    if (code) {
      axios
        .post(
          "https://us-central1-spotify-experience.cloudfunctions.net/authenticate",
          { code: code, redirect_uri: process.env.VUE_APP_REDIRECTURL }
        )
        .then(resp => {
          console.log(resp.data);
        });
    }

    //this.setAccessToken();

    // if (
    //   !this.$store.state.accessToken ||
    //   !this.$store.state.accessToken.length
    // ) {
    // }
  }
};
</script>

<style></style>
