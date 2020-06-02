<template>
  <q-page v-if="$store.state.accessToken">
    <div class="row">
      <div class="col">
        <q-card
          flat
          bordered
          v-if="accessTokenIsValid && currentTrack && currentTrackFeatures"
          class="q-ma-lg"
        >
          <q-card-section>
            <div class="row">
              <div class="col-sm-12 col-md-4 text-center">
                <div class="text-h5 text-left">Now Playing</div>
                <div class="row">
                  <div class="col">
                    <track-info :track="currentTrack.item" />
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <track-control
                      :track-id="currentTrack.item.id"
                      :is-playing="currentTrack.is_playing"
                      @refresh="getCurrentTrack"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-md-8">
                <div class="text-h5">Track Analysis</div>
                <track-analysis :features="currentTrackFeatures" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row" v-if="genius.song">
      <div class="col-sm-12 col-md-6">
        <q-card flat bordered class="q-ma-lg">
          <q-card-section v-if="genius.song.description.html != '<p>?</p>'">
            <div class="text-h6">Description</div>
            <div v-html="genius.song.description.html"></div>
          </q-card-section>
          <q-card-section>
            <div class="text-h6">Facts</div>
            <ul>
              <li v-if="genius.song.release_date_for_display">
                Release Date: {{ genius.song.release_date_for_display }}
              </li>
              <li v-if="genius.song.recording_location">
                Recording Location: {{ genius.song.recording_location }}
              </li>
            </ul>
          </q-card-section>
          <q-separator />
          <q-card-actions v-if="genius.song.url">
            <q-btn
              flat
              color="primary"
              type="a"
              :href="genius.song.url"
              target="_blank"
            >
              Read More on Genius.com
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import TrackAnalysis from "@/components/Track/TrackAnalysis";
import TrackInfo from "@/components/Track/TrackInfo";
import TrackControl from "@/components/Track/TrackControl";
import { mapMutations } from "vuex";
export default {
  components: {
    TrackAnalysis,
    TrackInfo,
    TrackControl
  },
  data() {
    return {
      currentTrack: null,
      currentTrackFeatures: null,
      poller: null,
      accessTokenIsValid: true,
      genius: {
        searchResults: [],
        song: null,
        artist: null
      }
    };
  },
  methods: {
    ...mapMutations(["setCurrentTrackId", "setAccessToken"]),
    stopPolling() {
      this.accessTokenIsValid = false;
      this.setAccessToken(null);
      clearInterval(this.poller);
    },
    getCurrentTrack() {
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { authorization: `Bearer ${this.$store.state.accessToken}` }
        })
        .then(response => {
          if (response.data.currently_playing_type === "track") {
            this.currentTrack = response.data;
            if (this.currentTrack.item.id != this.$store.state.currentTrackId) {
              this.getAdditionalTrackInformation(this.currentTrack);
            }
            this.setCurrentTrackId(this.currentTrack.item.id);
          }
        })
        .catch(() => {
          this.stopPolling();
        });
    },
    getAdditionalTrackInformation(spotifyTrack) {
      this.getAudioFeaturesForTrack(spotifyTrack.item.id);
      this.geniusSearch(spotifyTrack.item);
    },
    geniusSearch(track) {
      var q = `${track.name} ${track.artists[0].name}`;
      axios
        .get(
          `https://us-central1-spotify-experience.cloudfunctions.net/searchGenius?q=${encodeURIComponent(
            q
          )}`
        )
        .then(response => {
          this.genius.searchResults = response.data.response.hits;
          if (this.genius.searchResults && this.genius.searchResults.length) {
            this.getGeniusSongInfo(this.genius.searchResults[0].result.id);
          } else {
            this.genius.song = null;
            this.genius.artist = null;
          }
        });
    },
    getGeniusSongInfo(geniusSongId) {
      axios
        .get(
          `https://us-central1-spotify-experience.cloudfunctions.net/song?id=${geniusSongId}`
        )
        .then(response => {
          this.genius.song = response.data.response.song;
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
    }, 5000);
  }
};
</script>

<style></style>
