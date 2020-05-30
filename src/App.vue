<template>
  <div id="app">
    <button v-if="!accessToken || !accessToken.length" @click="authorize()">authorize</button>
    <div v-else>
      <button @click="getPlaylists()">Get Playlists</button>
      <div v-if="playlist">
        <h2>{{playlist.name}}</h2>
        <img :src="playlist.images[0].url"/>
      </div>
      <ul>
        <li v-for="playlist in playlists" :key="playlist.id" @click="getPlaylist(playlist.id)">
          {{playlist.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  components: {
 
  },
  data: function() {
    return {
        accessToken: '',
        playlists: [],
       playlist: null

      };
  },
  methods: {
    getPlaylists(){
      axios.get(`https://api.spotify.com/v1/me/playlists`, {headers : {authorization: `Bearer ${this.accessToken}` }}).then((response) => {
        this.playlists = response.data.items 
      })
    },
     getPlaylist(id){
      axios.get(`https://api.spotify.com/v1/playlists/${id}`, {headers : {authorization: `Bearer ${this.accessToken}` }}).then((response) => {
        console.log(response)
        this.playlist = response.data
      })
    },
    authorize(){
      var redirectUrl = 'http://localhost:8080'
      window.open(`https://accounts.spotify.com/authorize?client_id=${process.env.VUE_APP_SPOTIFYCLIENTID}&redirect_uri=${redirectUrl}&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token&state=123`)
    }
  },
  created(){
    let uri = window.location.hash.substring(1); 
    let params = new URLSearchParams(uri);
    this.accessToken = params.get('access_token')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
