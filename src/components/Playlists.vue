<template>
  <q-page>
    <div class="row" v-if="!accessToken || !accessToken.length">
      <div>
        <q-btn
          @click="authorize()"
          color="white"
          text-color="black"
          label="Authorize"
        />
      </div>
    </div>
    <div class="row col-gutter-xs window-height" v-else>
      <div class="col-4 full-height">
        <q-btn
          v-if="!playlists.length"
          @click="getPlaylists()"
          color="white"
          text-color="black"
          label="Get Playlists"
        />
        <q-virtual-scroll
          style="max-height: 100%;"
          :items="playlists"
          separator
        >
          <template v-slot="{ item, index }">
            <q-item
              clickable
              ripple
              :key="index"
              dense
              @click="getPlaylist(item.id)"
            >
              <q-item-section>
                <q-item-label>
                  {{ item.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-virtual-scroll>
      </div>
      <div class="col-8" v-if="playlist">
        <q-card class="my-card">
          <q-bar>
            <q-btn
              dense
              flat
              round
              icon="lens"
              size="8.5px"
              color="red"
              @click="playlist = null"
            />

            <div class="col text-center text-weight-bold">
              {{ playlist.name }}
            </div>
          </q-bar>
          <q-img
            :src="playlist.images[0].url"
            style="height: 140px; max-width: 150px"
          >
          </q-img>

          <q-card-section>
            <q-virtual-scroll
              style="max-height: 300px;"
              :items="playlist.tracks.items"
              separator
            >
              <template v-slot="{ item, index }">
                <q-item :key="index" dense>
                  <q-item-section>
                    <q-item-label>
                      {{ item.track.name }} - {{ item.track.artists[0].name }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
import axios from "axios";
export default {
  name: "Playlists",

  data() {
    return {
      accessToken: "",
      playlists: [],
      playlist: null
    };
  },
  methods: {
    getPlaylists() {
      axios
        .get(`https://api.spotify.com/v1/me/playlists`, {
          headers: { authorization: `Bearer ${this.accessToken}` }
        })
        .then(response => {
          this.playlists = response.data.items;
        });
    },
    getPlaylist(id) {
      axios
        .get(`https://api.spotify.com/v1/playlists/${id}`, {
          headers: { authorization: `Bearer ${this.accessToken}` }
        })
        .then(response => {
          this.playlist = response.data;
        });
    },
    authorize() {
      var redirectUrl = "http://localhost:8080";
      window.open(
        `https://accounts.spotify.com/authorize?client_id=${process.env.VUE_APP_SPOTIFYCLIENTID}&redirect_uri=${redirectUrl}&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&state=123`
      );
    }
  },
  created() {
    let uri = window.location.hash.substring(1);
    let params = new URLSearchParams(uri);
    this.accessToken = params.get("access_token");
    if (this.accessToken && this.accessToken.length) {
      this.getPlaylists();
    }
  }
};
</script>
