<template>
  <q-table
    :title="title"
    dense
    flat
    :data="tracks"
    :columns="columns"
    :pagination="initialPagination"
    row-key="id"
  >
    <template v-slot:body-cell-id="props">
      <q-td :props="props" auto-width>
        <q-spinner-audio
          v-if="props.value === nowPlayingId"
          color="primary"
          size="1em"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-uri="props">
      <q-td :props="props">
        <div>
          <q-btn
            round
            flat
            size="xs"
            @click="enqueue(props.value)"
            icon="playlist_add"
          >
            <q-tooltip
              content-class="bg-accent"
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
              >Add to Queue</q-tooltip
            >
          </q-btn>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      initialPagination: {
        rowsPerPage: 20
      },
      columns: [
        {
          name: "id",
          required: true,
          align: "right",
          field: row => row.id,
          format: val => `${val}`
        },
        {
          name: "name",
          required: true,
          label: "Track Name",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "uri",
          required: true,
          label: "",
          align: "right",
          field: row => row.uri,
          format: val => `${val}`
        }
      ]
    };
  },
  methods: {
    enqueue(trackId) {
      axios
        .post(
          `https://api.spotify.com/v1/me/player/queue?uri=${trackId}`,
          null,
          {
            headers: {
              authorization: `Bearer ${this.$store.state.accessToken}`
            }
          }
        )
        .then(() => {
          var track = this.tracks.find(x => x.uri == trackId);
          this.$q.notify({
            progress: true,
            color: "accent",
            message: `Added "${track.name}" to your play queue`,
            position: "top",
            timeout: 2500
          });
        })
        .catch(() => {});
    }
  },
  props: {
    title: {
      type: String
    },
    tracks: {
      type: Array,
      required: true
    },
    nowPlayingId: {
      type: String
    }
  }
};
</script>