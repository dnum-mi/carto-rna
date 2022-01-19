<template>
  <l-map
    style="height: 500px"
    :zoom="zoom"
    :center="center"
  >
    <l-tile-layer
      :url="url"
      :attribution="attribution"
    />
    <l-marker
      v-for="marker of markers"
      :key="`${marker.coordinates[0]}${marker.coordinates[1]}`"
      :lat-lng="marker.coordinates"
      @click="$emit('click:marker', marker)"
    >
      <l-popup v-if="marker.asso">
        <h6>
          {{ marker.asso.title }} <span class="small">({{ marker.asso.id }})</span>
        </h6>
        <h6>
          {{ marker.asso.objet }}
        </h6>
        <p class="fr-mb-0">
          {{ marker.asso.address.numeroVoie }} {{ marker.asso.address.typeVoie }} {{ marker.asso.address.voie }}
        </p>
        <p class="fr-mt-0">
          {{ marker.asso.address.cp }} {{ marker.asso.address.commune }}
        </p>
        <a :href="marker.asso.site">{{ marker.asso.site }}</a>
      </l-popup>
    </l-marker>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const parisCoord = [
  48.862682,
  2.341888,
]

export default {
  components: { LMap, LTileLayer, LMarker, LPopup },
  props: {
    zoom: {
      type: Number,
      default: 16,
    },
    center: {
      type: Array,
      default: () => parisCoord,
    },
    markers: {
      type: Array,
      default: () => [
        { coordinates: parisCoord },
      ],
    },
  },

  emits: ['click:marker'],

  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }
  },

}
</script>

<style scoped>
.fr-mb-0 {
  margin-bottom: 0 !important;
}
.fr-mt-0 {
  margin-top: 0 !important;
}

:deep(.leaflet-popup-close-button) {
  box-shadow: none !important;
}
</style>
