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
          format: val => `${val}`,
          sortable: true
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
        .then(() => {})
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
    }
  }
};
</script>
