<template>
  <q-page>
    <q-card
      flat
      bordered
      v-if="accessTokenIsValid && currentTrack && currentTrackFeatures"
      class="q-ma-lg"
    >
      <q-card-section>
        <div class="row">
          <div class="col-4">
            <div class="text-h5">Now Playing</div>
            <track-info :track="currentTrack.item" />
          </div>
          <div class="col-8">
            <div class="text-h5">Track Analysis</div>
            <track-analysis :features="currentTrackFeatures" />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-btn
      v-if="!accessTokenIsValid"
      @click="window.location = '~/'"
      label="Refresh Session"
    />
  </q-page>
</template>

<script>
import axios from "axios";
import TrackAnalysis from "@/components/Track/TrackAnalysis";
import TrackInfo from "@/components/Track/TrackInfo";
export default {
  components: {
    TrackAnalysis,
    TrackInfo
  },
  data() {
    return {
      currentTrack: null,
      currentTrackFeatures: null,
      poller: null,
      accessTokenIsValid: true
    };
  },
  methods: {
    stopPolling() {
      this.accessTokenIsValid = false;
      clearInterval(this.poller);
    },
    getCurrentTrack() {
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { authorization: `Bearer ${this.$store.state.accessToken}` }
        })
        .then(response => {
          this.currentTrack = response.data;
          this.getAudioFeaturesForTrack(this.currentTrack.item.id);
        })
        .catch(() => {
          this.stopPolling();
        });
    },
    getAudioFeaturesForTrack(trackId) {
      axios
        .get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: { authorization: `Bearer ${this.$store.state.accessToken}` }
        })
        .then(response => {
          this.currentTrackFeatures = response.data;
        })
        .catch(() => {
          this.stopPolling();
        });
    }
  },
  created() {
    this.getCurrentTrack();

    this.poller = setInterval(() => {
      this.getCurrentTrack();
    }, 10000);
  }
};
</script>

<style></style>
