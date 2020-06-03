<template>
  <q-page v-if="$store.state.accessToken">
    <h4
      class="text-center q-mb-none font-anton text-uppercase text-italic"
      v-if="currentTrack"
    >
      Now Playing
    </h4>
    <div class="row" v-if="currentTrack && currentTrackFeatures">
      <div class="col">
        <q-card flat bordered class="q-ma-lg">
          <q-card-section>
            <div class="row">
              <div class="col-xs-12 col-md-4 text-center q-pa-md">
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
              <div class="col-xs-12 col-md-8 q-pa-md">
                <track-list
                  :tracks="currentAlbumTracks"
                  :now-playing-id="currentTrack.item.id"
                  :title="currentTrack.item.album.name"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center window-height items-center" v-else>
      <div class="text-center">
        <q-spinner-audio color="primary" size="3em" />
        <div class="text-h5 font-anton text-uppercase text-italic">
          Looking for Audio...
        </div>
        <div class="text-subtitle1">
          Please note only music is supported at this time
        </div>
      </div>
    </div>

    <div class="row">
      <div
        class="col-sm-12 col-md-6"
        v-if="currentTrack && currentTrackFeatures"
      >
        <div class="row">
          <div class="col">
            <q-card flat bordered class="q-ma-lg">
              <q-card-section>
                <artist-info
                  :id="currentTrack.item.artists[0].id"
                  :now-playing-id="currentTrack.item.id"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-card flat bordered class="q-ma-lg">
              <q-card-section>
                <div class="text-h5 font-anton text-uppercase text-italic">
                  Track Analysis
                </div>
                <track-analysis :features="currentTrackFeatures" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6" v-if="genius.song">
        <q-card flat bordered class="q-ma-lg">
          <q-card-section v-if="genius.song.description.html != '<p>?</p>'">
            <div class="text-h5 font-anton text-uppercase text-italic">
              Description
            </div>
            <div
              class="flat-links"
              style="overflow-x: auto;"
              v-html="genius.song.description.html"
            ></div>
          </q-card-section>
          <q-card-section>
            <div class="text-h5 font-anton text-uppercase text-italic">
              Facts
            </div>
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
import TrackList from "@/components/Track/TrackList";
import ArtistInfo from "@/components/Artist/ArtistInfo";
import { mapMutations } from "vuex";
export default {
  components: {
    TrackAnalysis,
    TrackInfo,
    TrackControl,
    TrackList,
    ArtistInfo
  },
  data() {
    return {
      currentTrack: null,
      currentTrackFeatures: null,
      currentAlbumTracks: [],
      currentArtist: null,
      currentArtistPopularTracks: [],
      poller: null,
      genius: {
        searchResults: [],
        song: null,
        artist: null
      }
    };
  },
  methods: {
    ...mapMutations(["setCurrentTrackId"]),
    stopPolling() {
      clearInterval(this.poller);
    },
    getCurrentTrack() {
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { authorization: `Bearer ${this.$store.state.accessToken}` }
        })
        .then(response => {
          if (response.status === 204) {
            return;
          }
          if (response.data.currently_playing_type === "track") {
            this.currentTrack = response.data;
            if (this.currentTrack.item.id != this.$store.state.currentTrackId) {
              this.getAdditionalTrackInformation(this.currentTrack);
            }
            this.setCurrentTrackId(this.currentTrack.item.id);
          } else {
            this.currentTrack = null;
            this.genius.song = null;
            this.setCurrentTrackId(null);
          }
        })
        .catch(() => {
          this.stopPolling();
        });
    },
    getAdditionalTrackInformation(spotifyTrack) {
      this.getAudioFeaturesForTrack(spotifyTrack.item.id);
      this.getTracksOnAlbum(spotifyTrack.item.album.id);
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
    getTracksOnAlbum(albumId) {
      axios
        .get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
          headers: { authorization: `Bearer ${this.$store.state.accessToken}` }
        })
        .then(response => {
          this.currentAlbumTracks = response.data.items;
        })
        .catch(() => {});
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
    this.currentTrack = null;
    this.setCurrentTrackId(null);
    this.getCurrentTrack();

    this.poller = setInterval(() => {
      this.getCurrentTrack();
    }, 5000);
  }
};
</script>

<style></style>
