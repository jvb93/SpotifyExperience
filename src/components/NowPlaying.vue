<template>
  <q-page>
    <q-card
      flat
      bordered
      v-if="currentTrack && currentTrackFeatures"
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
      currentTrackFeatures: null
    };
  },
  methods: {
    getCurrentTrack() {
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { authorization: `Bearer ${this.$store.state.accessToken}` }
        })
        .then(response => {
          this.currentTrack = response.data;
          this.getAudioFeaturesForTrack(this.currentTrack.item.id);
        });
    },
    getAudioFeaturesForTrack(trackId) {
      axios
        .get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: { authorization: `Bearer ${this.$store.state.accessToken}` }
        })
        .then(response => {
          this.currentTrackFeatures = response.data;
        });
    }
  },
  created() {
    this.getCurrentTrack();

    setInterval(() => {
      this.getCurrentTrack();
    }, 10000);
  }
};
</script>

<style></style>
