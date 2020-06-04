<template>
  <q-btn-group class="full-width" spread flat>
    <q-btn @click="back()" icon="skip_previous" />
    <q-btn @click="togglePlayback()" :icon="playPauseButtonIcon" />
    <q-btn @click="skip()" icon="skip_next" />
  </q-btn-group>
</template>

<script>
import axios from "axios";
import { GetTokenInfo } from "@/services/auth.js";
export default {
  props: {
    trackId: {
      type: String,
      required: true
    },
    isPlaying: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      accessToken: null
    };
  },
  methods: {
    skip() {
      GetTokenInfo().then(token => {
        this.accessToken = token.accessToken;
        axios
          .post("https://api.spotify.com/v1/me/player/next", null, {
            headers: { authorization: `Bearer ${this.accessToken}` }
          })
          .then(() => {
            this.requestRefresh();
          })
          .catch(() => {});
      });
    },
    togglePlayback() {
      let url = this.isPlaying
        ? "https://api.spotify.com/v1/me/player/pause"
        : "https://api.spotify.com/v1/me/player/play";

      GetTokenInfo().then(token => {
        this.accessToken = token.accessToken;
        axios
          .put(url, null, {
            headers: {
              authorization: `Bearer ${this.accessToken}`
            }
          })
          .then(() => {
            this.requestRefresh();
          })
          .catch(() => {});
      });
    },
    back() {
      GetTokenInfo().then(token => {
        this.accessToken = token.accessToken;
        axios
          .post("https://api.spotify.com/v1/me/player/previous", null, {
            headers: {
              authorization: `Bearer ${this.accessToken}`
            }
          })
          .then(() => {
            this.requestRefresh();
          })
          .catch(() => {});
      });
    },
    requestRefresh() {
      this.$emit("refresh");
    }
  },
  computed: {
    playPauseButtonIcon() {
      return this.isPlaying ? "pause" : "play_arrow";
    }
  }
};
</script>
