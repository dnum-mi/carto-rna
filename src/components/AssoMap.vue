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
      :key="`${marker[0]}${marker[1]}`"
      :lat-lng="marker"
    />
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const parisCoord = [
  48.862682,
  2.341888,
]

export default {
  components: { LMap, LTileLayer, LMarker },
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
        parisCoord,
      ],
    },
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }
  },

}
</script>
