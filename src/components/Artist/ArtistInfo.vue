<template>
  <div>
    <div class="text-h5 font-anton text-uppercase text-italic">
      Artist Info
    </div>
    <div v-if="artist" class="q-mb-md">
      <div class="row">
        <q-img
          class="col q-ma-md rounded-borders"
          transition="fade"
          :src="artist.images[0].url"
          style="max-width:150px; max-height:150px;"
        />
        <div class="col q-ma-md">
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
      artist: null
    };
  },
  methods: {
    getArtistInfo(artistId) {
      axios
        .get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            authorization: `Bearer ${this.$store.state.accessToken}`
          }
        })
        .then(response => {
          this.artist = response.data;
        });
    },
    getPopularTracksForArtist(artistId) {
      axios
        .get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=from_token`,
          {
            headers: {
              authorization: `Bearer ${this.$store.state.accessToken}`
            }
          }
        )
        .then(response => {
          this.popularTracks = response.data.tracks;
        });
    },
    refresh() {
      this.getPopularTracksForArtist(this.id);
      this.getArtistInfo(this.id);
    }
  },
  watch: {
    id() {
      this.refresh();
    }
  },
  created() {
    this.refresh();
  }
};
</script>
