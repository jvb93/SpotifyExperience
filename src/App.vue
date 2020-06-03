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
</style>
<script>
import { mapMutations } from "vuex";
import { GetTokenInfo } from "@/services/auth.js";
export default {
  methods: {
    ...mapMutations(["setAccessToken"])
  },
  created() {
    this.$q.dark.set(true);
    var token = GetTokenInfo();
    if (token) {
      this.setAccessToken(token.accessToken);
    }
  }
};
</script>
