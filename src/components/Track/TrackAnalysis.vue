<template>
  <div>
    <q-linear-progress
      size="xl"
      :value="features.acousticness"
      class="q-mt-md"
    />
    <p>
      Acousticness
      <q-icon name="info" class="cursor-pointer" />
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="power_off" color="primary" />
          </template>
          {{ descriptions.acousticness }}
        </q-banner>
      </q-popup-proxy>
    </p>
    <q-linear-progress
      size="xl"
      :value="features.danceability"
      class="q-mt-md"
    />
    <p>
      Danceability
      <q-icon name="info" class="cursor-pointer" />
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="sports_kabaddi" color="primary" />
          </template>
          {{ descriptions.danceability }}
        </q-banner>
      </q-popup-proxy>
    </p>

    <q-linear-progress size="xl" :value="features.energy" class="q-mt-md" />
    <p>
      Energy
      <q-icon name="info" class="cursor-pointer" />
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="flash_on" color="primary" />
          </template>
          {{ descriptions.energy }}
        </q-banner>
      </q-popup-proxy>
    </p>

    <q-linear-progress
      size="xl"
      :value="features.instrumentalness"
      class="q-mt-md"
    />
    <p>
      Instrumentalness
      <q-icon name="info" class="cursor-pointer" />
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="radio" color="primary" />
          </template>
          {{ descriptions.instrumentalness }}
        </q-banner>
      </q-popup-proxy>
    </p>

    <q-linear-progress size="xl" :value="features.liveness" class="q-mt-md" />
    <p>
      Liveness
      <q-icon name="info" class="cursor-pointer" />
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="mic" color="primary" />
          </template>
          {{ descriptions.liveness }}
        </q-banner>
      </q-popup-proxy>
    </p>

    <q-linear-progress size="xl" :value="features.valence" class="q-mt-md" />
    <p>
      Valence
      <q-icon name="info" class="cursor-pointer" />
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="sentiment_satisfied_alt" color="primary" />
          </template>
          {{ descriptions.valence }}
        </q-banner>
      </q-popup-proxy>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    features: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      descriptions: {
        acousticness: "A confidence measure whether the track is acoustic.",
        danceability:
          "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.",
        energy:
          "Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
        instrumentalness:
          "Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”.",
        liveness:
          "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.",
        valence:
          "A measure describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
      }
    };
  }
};
</script>

<style></style>
