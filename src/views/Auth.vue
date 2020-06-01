<template>
  <p>Auth complete, redirecting...</p>
</template>
<script>
import { mapMutations } from "vuex";
import axios from "axios";
export default {
  methods: {
    ...mapMutations(["setAccessToken"])
  },
  created() {
    var code = this.$route.query.code;
    if (code) {
      axios
        .post(
          "https://us-central1-spotify-experience.cloudfunctions.net/authenticate",
          { code: code, redirect_uri: process.env.VUE_APP_REDIRECTURL }
        )
        .then(resp => {
          this.setAccessToken(resp.data.access_token);
          this.$router.push("/");
        });
    }
  }
};
</script>
