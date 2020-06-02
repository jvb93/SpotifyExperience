<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style></style>
<script>
import { mapMutations } from "vuex";
import { GetTokenInfo } from "@/services/auth.js";
export default {
  methods: {
    ...mapMutations(["setAccessToken"])
  },
  created() {
    var token = GetTokenInfo();
    if (token) {
      this.setAccessToken(token.accessToken);
    }
  }
};
</script>
