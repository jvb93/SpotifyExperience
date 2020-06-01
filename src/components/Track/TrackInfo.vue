<template>
  <div>
    <img
      :src="track.album.images[0].url"
      style="max-height:300px; max-width: 300px; width: auto; height: auto;"
    />
    <div class="text-h6">{{ track.name }}</div>
    <div class="text-subtitle2">
      {{ artistNames(track) }}
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
