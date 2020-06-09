<template>
  <div>
    <div class="row">
      <div class="col">
        <q-img
          :src="track.album.images[0].url"
          transition="fade"
          class="rounded-borders q-mb-md"
          style="max-width: 300px; max-height:300px;"
        ></q-img>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="text-h5 font-anton text-uppercase text-italic">
          {{ track.name }}
        </div>
        <div class="text-subtitle2">
          {{ artistNames(track) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  methods: {
    artistNames(track) {
      var justNames = track.artists.map(x => x.name);
      return justNames.join(", ");
    }
  }
};
</script>

<style></style>
