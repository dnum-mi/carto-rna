<script>
import { defineComponent } from 'vue'
import debounce from 'debounce-fn'

import AssoMap from '../components/AssoMap.vue'

const adresseApiBaseUrl = 'https://api-adresse.data.gouv.fr/search/?q='

const baseUrl = import.meta.env.BASE_URL || 'https://ines-api.dsic.minint.fr/gdr/v1/associations/'

function assoProjection ({
  id_association: id,
  site_web: url,
  etat,
}) {
  return {
    id,
    nom,
    adresseSiege,
    objet,
    etat,
    url,
  }
}

export default defineComponent({
  name: 'HomeSweetHome',
  components: {
    AssoMap,
  },

  data () {
    return {
      query: '',
      codeDept: '',
      fuzzy: false,
      results: [],
      markers: undefined,
      center: undefined,
      activeResultIndex: undefined,
      assoInfo: undefined,
      debouncedSearch: debounce(() => { this.search() }, { wait: 300 }),
      resetResult: () => { this.result = [] },
    }
  },

  watch: {
    query (newQuery, oldQuery) {
      const resultText = this.results[this.activeResultIndex]?.text
      if (!newQuery || newQuery === resultText) {
        this.results = []
        return
      }
      this.debouncedSearch()
    },
  },

  mounted () {
    document.addEventListener('click', this.resetResult)
  },

  beforeUnmount () {
    document.removeEventListener('click', this.resetResult)
  },

  methods: {
    search () {
      if (!this.query) {
        return
      }
      const url = `${baseUrl}?q=${this.query}&limit=${this.limit}&fuzzy_match=${this.fuzzy}&code_departement=${this.departement}`
      fetch(url)
        .then(res => res.json())
        .then(({ features }) => {
          this.results = features.map(assoProjection)
          this.nombre = nombre
        })
        /*
      fetch(adresseApiBaseUrl + this.query)
        .then(res => res.json())
        .then(apiResults => {
          this.results = apiResults.features.map(function ({
            geometry: { coordinates },
            properties: { label, context },
          }) {
            return {
              text: label + ' (' + context + ')',
              coordinates: coordinates.reverse(),
            }
          })
          this.markers = this.results.map(function ({ coordinates }) {
            return coordinates
          })
          this.center = this.markers[0]
        })
        */
    },

    nextResult () {
      if (this.activeResultIndex === undefined) {
        this.activeResultIndex = 0
        return
      }
      if (this.activeResultIndex === this.markers.length - 1) {
        return
      }
      this.activeResultIndex++
    },

    previousResult () {
      if (this.activeResultIndex === 0) {
        return
      }
      this.activeResultIndex--
    },

    setActiveMarker (result, idx) {
      this.activeResultIndex = idx
      this.center = result.coordinates
      this.marker = result.coordinates
      this.query = result.text
      this.assoInfo = result.text
    },
  },
})
</script>

<template>
  <h1 class="fr-container">
    Recherche Adresse
  </h1>
  <main class="main  fr-container">
    <div class="search">
      <div class="inline">
        <DsfrSearchBar
          v-model="query"
          @keyup.arrow-up="previousResult()"
          @keyup.arrow-down="nextResult()"
          @keyup.escape="results = []"
          @keyup.enter="setActiveMarker(results[activeResultIndex], activeResultIndex)"
          @click.stop=""
        />
        <DsfrToggleSwitch
          v-model="fuzzy"
          label="Orthographe approx."
        />
        <div>
          <DsfrInput
            v-model="codeDept"
            placeholder="Code département"
          />
        </div>
        <DsfrSelect
          v-model="limit"
          class="fr-ml-1v  fr-mb-0"
          label="Nombre max de résultats :"
          :options="[5, 10, 20]"
        />
      </div>
      <div
        v-show="results.length"
        class="search-results"
        @mouseover="activeResultIndex = undefined"
        @click.stop=""
      >
        <ul>
          <li
            v-for="(result, idx) of results"
            :key="idx"
            class="search-result"
            :class="{ active: idx === activeResultIndex }"
            @click="setActiveMarker(result, idx)"
          >
            {{ result.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="carto-container">
      <div class="asso-info">
        Informations sur l'association :
        <div>
          {{ assoInfo }}
        </div>
      </div>
      <div class="map">
        <AssoMap
          :center="center"
          :markers="markers"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.carto-container {
  display: flex;
  margin: 0 auto;
  width: 100%;
}
.asso-info, .map {
  flex-basis: 50%;
  max-width: 50%;
  flex-shrink: 0;
  flex-grow: 0;
}

.asso-info {
  height: 500px;
  margin-right: 0.5rem;
  padding: 1em;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.search {
  margin-block: 1em;
}

.list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
}

.list__item {
  flex-basis: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-block: 0.375em;
}

.list__item:nth-child(even) {
  background-color: var(--beige);
}

.list__item:nth-child(odd) {
  background-color: var(--white);
}

.overflow-hidden {
  overflow: hidden;
}

.search-results {
  position: absolute;
  background-color: white;
  z-index: 1001;
  padding: 0.5rem;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.search-result.active,
.search-result:hover {
  background-color: var(--bf500);
  cursor: pointer;
  color: white;
  font-weight: 700;
}
.search-result:hover::before,
.search-result.active::before {
  content: "> ";
  color: white;
  font-weight: 700;
}

.search-results ul {
  list-style: none;
}

.inline {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
}

:deep(.fr-select-group) {
  display: flex;
  align-items: center;
}
:deep(.fr-input) {
  margin-left: 0.5rem;
}

:deep(.fr-label) {
  white-space: nowrap;
}

:deep(.fr-select) {
  margin-top: 0;
}

:deep(.fr-toggle) {
  position: relative;
  top: 0.5rem;
  padding: 0;
  margin-left: 0.5rem;
}
:deep(.fr-toggle label::after) {
  top: 0;
}
:deep(.fr-toggle .after) {
  top: 0;
}
</style>
