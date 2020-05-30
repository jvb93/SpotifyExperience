<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <Playlists />
    </q-page-container>
  </q-layout>
</template>

<script>
import Playlists from "./components/Playlists.vue";

export default {
  name: "LayoutDefault",

  components: {
    Playlists
  },

  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>

<style></style>
