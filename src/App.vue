<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
.font-anton {
  font-family: "Anton", sans-serif;
}
.flat-links a {
  color: var(--q-color-primary) !important;
}

.img-small img {
  max-width: 150px !important;
  max-height: 150px !important;
}
.img-small iframe {
  display: none;
}
.q-table__title {
  font-family: "Anton", sans-serif;
  font-style: italic;
  text-transform: uppercase;
}
</style>
<script>
export default {
  methods: {},
  created() {
    this.$q.dark.set(true);
  }
};
</script>
