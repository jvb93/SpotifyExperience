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
</style>
<script>
export default {
  methods: {},
  created() {
    this.$q.dark.set(true);
  }
};
</script>
