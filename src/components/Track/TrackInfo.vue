<template>
  <div>
    <img
      :src="track.album.images[0].url"
      style="max-height:300px; max-width: 300px; width: auto; height: auto;"
    />
    <div class="text-h6">{{ track.name }}</div>
    <div class="text-subtitle2">
      {{ track.artists[0].name }}
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
  }
};
</script>

<style></style>
