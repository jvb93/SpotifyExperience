<template>
  <div class="home">
    <NowPlaying v-if="$store.state.accessToken" />
    <div v-else class="row items-center fullscreen">
      <div class="col text-center">
        <q-btn
          @click="authorize()"
          align="between"
          class="btn-fixed-width"
          color="positive"
          label="Authorize with Spotify"
          icon="lock"
        />
      </div>
    </div>
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
