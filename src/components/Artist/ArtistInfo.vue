<template>
  <div>
    <div class="text-h5 font-anton text-uppercase text-italic q-mb-md">
      Artist Info
    </div>
    <div v-if="artist" class="q-mb-md">
      <div class="row">
        <q-img
          class="col-sm-12 col-md-4 rounded-borders"
          transition="fade"
          :ratio="1"
          style="max-height: 150px; max-width:150px;"
          :src="artist.images[0].url"
        />
        <div class="col-sm-12 q-pa-md col-md-8">
          <div class="text-h6">
            {{ artist.name }}

            <q-circular-progress
              show-value
              class="q-ma-md float-right"
              :value="artist.popularity"
              size="50px"
              color="primary"
            >
              {{ artist.popularity }}
              <q-tooltip content-class="bg-accent">
                Popularity
              </q-tooltip>
            </q-circular-progress>
          </div>
          <q-chip
            v-for="(genre, idx) in artist.genres"
            :key="idx"
            outline
            color="primary"
            text-color="white"
          >
            {{ genre }}
          </q-chip>
          <div class="text-overline">
            {{ artist.followers.total }} followers
          </div>
          <div
            v-if="genius"
            class="flat-links q-pt-lg img-small"
            v-html="genius.description.html"
          ></div>
        </div>
      </div>
    </div>
    <track-list
      title="Top tracks"
      :tracks="popularTracks"
      :now-playing-id="nowPlayingId"
    />
  </div>
</template>

<script>
import axios from "axios";
import TrackList from "@/components/Track/TrackList";
import { GetTokenInfo } from "@/services/auth.js";
export default {
  components: {
    TrackList
  },
  props: {
    id: {
      type: String,
      required: true
    },
    nowPlayingId: {
      type: String
    }
  },
  data() {
    return {
      popularTracks: [],
      accessToken: null,
      artist: null,
      genius: null
    };
  },
  methods: {
    getArtistInfo(artistId) {
      axios
        .get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            authorization: `Bearer ${this.accessToken}`
          }
        })
        .then(response => {
          this.artist = response.data;
        });
    },
    geniusSearch(q) {
      axios
        .get(
          `https://us-central1-spotify-experience.cloudfunctions.net/searchGenius?q=${encodeURIComponent(
            q
          )}`
        )
        .then(response => {
          if (
            response.data.response.hits &&
            response.data.response.hits.length
          ) {
            var exactMatch = response.data.response.hits.find(x => {
              let sanitizedGeniusName = x.result.primary_artist.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

              let sanitizedSpotifyName = q
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

              let equal = sanitizedGeniusName === sanitizedSpotifyName;
              return equal;
            });
            if (exactMatch) {
              this.getGeniusInfo(exactMatch.result.primary_artist.id);
            } else {
              this.genius = null;
            }
          } else {
            this.genius = null;
          }
        });
    },
    getGeniusInfo(geniusArtistId) {
      axios
        .get(
          `https://us-central1-spotify-experience.cloudfunctions.net/artist?id=${geniusArtistId}`
        )
        .then(response => {
          this.genius = response.data.response.artist;
        });
    },
    getPopularTracksForArtist(artistId) {
      axios
        .get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=from_token`,
          {
            headers: {
              authorization: `Bearer ${this.accessToken}`
            }
          }
        )
        .then(response => {
          this.popularTracks = response.data.tracks;
        });
    },
    refresh() {
      GetTokenInfo().then(token => {
        this.accessToken = token.accessToken;
        this.getPopularTracksForArtist(this.id);
        this.getArtistInfo(this.id);
      });
    }
  },
  watch: {
    id() {
      this.refresh();
    },
    artist() {
      this.genius = null;
      this.geniusSearch(this.artist.name);
    }
  },
  created() {
    this.refresh();
  }
};
</script>
