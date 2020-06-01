<template>
  <div class="home">
    <NowPlaying v-if="$store.state.accessToken" />
    <q-btn v-else @click="authorize()" label="authorize" />
  </div>
</template>

<script>
// @ is an alias to /src
import NowPlaying from "@/components/NowPlaying.vue";

export default {
  name: "home",
  components: {
    NowPlaying
  },
  methods: {
    authorize() {
      window.open(
        `https://accounts.spotify.com/authorize?client_id=${process.env.VUE_APP_SPOTIFYCLIENTID}&redirect_uri=${process.env.VUE_APP_REDIRECTURL}&scope=${process.env.VUE_APP_SPOTIFYSCOPE}&response_type=code`
      );
    }
  }
};
</script>
