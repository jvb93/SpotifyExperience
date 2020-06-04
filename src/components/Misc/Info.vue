<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" @click="$emit('close')">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h4 font-anton text-uppercase text-italic">
          The Spotify Experience
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        An app for music nerds to learn about their favorite songs or maybe
        discover some new ones.
      </q-card-section>

      <q-card-section>
        <div class="text-h6 font-anton text-uppercase text-italic">
          How to use
        </div>
        <ol>
          <li>Launch The Spotify Experience</li>
          <li>Connect with your Spotify account</li>
          <li>Launch Spotify, play some music</li>
          <li>Enjoy</li>
        </ol>
      </q-card-section>

      <q-card-section>
        <div class="text-h6 font-anton text-uppercase text-italic">
          Privacy
        </div>
        The Spotify Experience goes to great lengths to not collect your data.
        All app data stays within your browser and is never shared. Do note, 3rd
        party APIs are used including Spotify and Genius.com, we cannot say what
        they choose to do with your data.
      </q-card-section>

      <q-card-section>
        <div class="text-h6 font-anton text-uppercase text-italic">
          Attribution
        </div>
        The Spotify Experience uses data from:
        <ul>
          <li>
            Spotify.com
            <a
              class="text-black"
              target="_blank"
              href="https://developer.spotify.com/terms/"
              >(Terms and Conditions)</a
            >
          </li>
          <li>
            Genius.com
            <a
              class="text-black"
              target="_blank"
              href="https://genius.com/static/terms"
              >(Terms and Conditions)</a
            >
          </li>
        </ul>
      </q-card-section>
      <q-separator dark inset />
      <q-card-actions class="justify-end">
        <q-btn
          type="a"
          target="_blank"
          outline
          size="sm"
          href="https://github.com/jvb93/SpotifyExperience"
        >
          Made with ❤ by @jvb93
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  methods: {
    requestClose() {
      this.$emit("close");
    }
  },
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  }
};
</script>
