<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <now-playing />
    </q-page-container>
  </q-layout>
</template>

<script>
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
        `https://accounts.spotify.com/authorize?client_id=${process.env.VUE_APP_SPOTIFYCLIENTID}&redirect_uri=${process.env.VUE_APP_REDIRECTURL}&scope=${process.env.VUE_APP_SPOTIFYSCOPE}&response_type=token&state=123`
      );
    }
  },
  created() {
    let uri = window.location.hash.substring(1);
    let params = new URLSearchParams(uri);
    this.setAccessToken(params.get("access_token"));

    if (
      !this.$store.state.accessToken ||
      !this.$store.state.accessToken.length
    ) {
      this.authorize();
    }
  }
};
</script>

<style></style>
