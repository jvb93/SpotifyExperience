<template>
  <q-page>
    <div v-if="!sessionExpired">
      <h4
        class="text-center q-mb-none font-anton text-uppercase text-italic"
        v-if="currentTrack"
      >
        Now Playing
      </h4>
      <template v-if="currentTrack && currentTrackFeatures">
        <div class="row">
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
        <div class="row">
          <div class="col-sm-12 col-md-6">
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
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row" v-if="genius.song">
              <div class="col">
                <q-card flat bordered class="q-ma-lg">
                  <q-card-section
                    v-if="genius.song.description.html != '<p>?</p>'"
                  >
                    <div
                      class="text-h5 font-anton text-uppercase text-italic q-mb-md"
                    >
                      Track Description
                    </div>
                    <div
                      class="flat-links img-small"
                      style="overflow-x: auto;"
                      v-html="genius.song.description.html"
                    ></div>
                  </q-card-section>
                  <q-card-section>
                    <div
                      class="text-h5 font-anton text-uppercase text-italic"
                      v-if="
                        genius.song.release_date_for_display ||
                          genius.song.recording_location
                      "
                    >
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
        </div>
      </template>

      <div class="row justify-center window-height items-center" v-else>
        <div class="text-center">
          <q-spinner-audio color="primary" size="3em" />
          <div class="text-h5 font-anton text-uppercase text-italic">
            Looking for Audio...
          </div>
          <div class="text-subtitle2">
            Play something on Spotify!
          </div>
          <div class="text-caption text-weight-thin">
            Please note only music is supported at this time
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row items-center fullscreen">
      <div class="col text-center">
        <q-btn
          @click="reload()"
          align="between"
          class="btn-fixed-width"
          color="primary"
          label="Session Expired, click to refresh"
          icon="refresh"
        />
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
import { GetTokenInfo } from "@/services/auth";
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
      poller: null,
      sessionExpired: false,
      accessToken: null,
      currentTrack: null,
      currentTrackFeatures: null,
      currentAlbumTracks: [],
      currentArtist: null,
      currentArtistPopularTracks: [],
      genius: {
        searchResults: [],
        song: null,
        artist: null
      }
    };
  },
  methods: {
    ...mapMutations(["setCurrentTrackId"]),

    getCurrentTrack() {
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { authorization: `Bearer ${this.accessToken}` }
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
        .catch(() => {});
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
          `${
            process.env.VUE_APP_FIREBASE_FUNCTIONS_BASE
          }/searchGenius?q=${encodeURIComponent(q)}`
        )
        .then(response => {
          this.genius.searchResults = response.data.response.hits;
          if (this.genius.searchResults && this.genius.searchResults.length) {
            var exactMatch = this.genius.searchResults.find(x => {
              let sanitizedGeniusName = this.sanitizeString(
                x.result.primary_artist.name
              );
              let sanitizedSpotifyName = this.sanitizeString(
                track.artists[0].name
              );
              return sanitizedGeniusName === sanitizedSpotifyName;
            });
            if (exactMatch) {
              this.getGeniusSongInfo(exactMatch.result.id);
            } else {
              this.genius.song = null;
              this.genius.artist = null;
            }
          } else {
            this.genius.song = null;
            this.genius.artist = null;
          }
        });
    },
    getGeniusSongInfo(geniusSongId) {
      axios
        .get(
          `${process.env.VUE_APP_FIREBASE_FUNCTIONS_BASE}/song?id=${geniusSongId}`
        )
        .then(response => {
          this.genius.song = response.data.response.song;
        });
    },
    getTracksOnAlbum(albumId) {
      axios
        .get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
          headers: { authorization: `Bearer ${this.accessToken}` }
        })
        .then(response => {
          this.currentAlbumTracks = response.data.items;
        })
        .catch(() => {});
    },
    getAudioFeaturesForTrack(trackId) {
      axios
        .get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: { authorization: `Bearer ${this.accessToken}` }
        })
        .then(response => {
          this.currentTrackFeatures = response.data;
        })
        .catch(() => {});
    },
    sanitizeString(inputString) {
      return inputString.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, "");
    },
    reload() {
      location.reload();
    }
  },
  created() {
    this.currentTrack = null;
    this.setCurrentTrackId(null);
    GetTokenInfo().then(token => {
      this.accessToken = token.accessToken;
      this.getCurrentTrack();
    });

    let pollExpiration = new Date();
    pollExpiration.setHours(pollExpiration.getHours() + 1);

    this.poller = setInterval(() => {
      GetTokenInfo().then(token => {
        this.accessToken = token.accessToken;
        this.getCurrentTrack();
        if (new Date() > pollExpiration) {
          clearInterval(this.poller);
          this.sessionExpired = true;
        }
      });
    }, 5000);
  }
};
</script>

<style></style>
