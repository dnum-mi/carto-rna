<script>
import { defineComponent } from 'vue'
import debounce from 'debounce-fn'

import AssoMap from '../components/AssoMap.vue'
import { createWebHistory } from 'vue-router'

const adresseApiBaseUrl = import.meta.env.VITE_API_BAN_URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'https://ines-api.dsic.minint.fr/gdr/v1/associations/'
const apiEtablissementsPublicsUrl = import.meta.env.VITE_API_ETABLISSEMENTS_PUBLICS_URL

function assoProjection (asso) {
  return {
    ...asso,
    text: `${asso.titre.court} (${asso.adresse_siege.code_postal})`,
  }
}

function getPostalAddressFromAssoInfo ({ adresse_siege: { numero_voie, type_voie, libelle_voie, code_postal, libelle_commune } }) {
  return `${numero_voie} ${type_voie} ${libelle_voie} ${code_postal} ${libelle_commune}`
}

function getCoordinatesFromPostalAddress (postalAddress) {
  return fetch(adresseApiBaseUrl + '/?q=' +postalAddress)
    .then(res => res.json())
    .then(apiReturn => apiReturn.features[0].geometry.coordinates.reverse())
}

function getColumns (asso, columns = Object.keys(asso)) {
  return columns.map(key => asso[key])
}

function simplifyAsso ({
  id_association: id,
  themes: themes,
  groupement: groupement,
  titre: {
    long: title,
    court: shortTitle,
  },
  objet: object,
  objet_social: objetSocial,
  adresse_siege: {
    numero_voie: numeroVoie,
    type_voie: typeVoie,
    libelle_voie: voie,
    libelle_commune: commune,
    code_postal: cp,
    code_insee: codeInsee,
    code_departement: codeDepartement
  },
  adresse_declarant:{
    libelle: libelle,
    format_postal: formatPostal,
    libelle_voie: libelleVoie,
    distribution: distribution,
    code_postal: cpAdresseDeclarant,
    acheminement: acheminement,
    pays: pays
  },
  type_dirigeant: typeDirigeant,
  site_web: site,
  etat,
  date_creation: dateCreation,
  date_publication: datePublication,
  date_declaration_dissolution: dateDissolution,
  date_derniere_modification: dateDerniereModification,
  derniere_maj: dateDerniereMiseAJour
}) {
  return {
    id,
    title,
    shortTitle,
    object,
    objetSocial,
    fullAddress: `${numeroVoie} ${typeVoie.toLowerCase()} ${voie} ${commune} ${cp}`,
    address: {
      numeroVoie,
      typeVoie: typeVoie.toLowerCase(),
      voie,
      commune,
      cp,
      codeInsee,
      codeDepartement
    },
    site,
    typeDirigeant,
    etat,
    active: etat === 'active',
    text: `${title} - ${cp} (${id})`,
    dateCreation,
    dateDissolution,
    datePublication,
    dateDerniereModification,
    dateDerniereMiseAJour
  }
}

export default defineComponent({
  name: 'HomeSweetHome',
  components: {
    AssoMap,
  },

  data () {
    return {
      rawAssociations: undefined,
      asso: undefined,
      query: '',
      codeDept: '',
      fuzzy: false,
      limit: 5,
      results: [],
      markers: undefined,
      center: undefined,
      activeResultIndex: undefined,
      debouncedSearch: debounce(() => { this.search() }, { wait: 300 }),
      resetResult: () => { this.results = [] },
    }
  },

  watch: {
    query (newQuery,
      oldQuery) {
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
      const headers = { Accept: 'application/json' }
      let url = ''

      if (this.codeDept.length !== 0) {
        url = `${apiBaseUrl}search?q=${this.query}&limit=${this.limit}&fuzzy_match=${this.fuzzy}&code_departement=${this.codeDept}`
      } else {
        url = `${apiBaseUrl}search?q=${this.query}&limit=${this.limit}&fuzzy_match=${this.fuzzy}`
      }

      fetch(url, { headers })
        .then(res => res.json())
        .then(({ associations }) => {
          this.rawAssociations = associations
          this.results = associations.map(simplifyAsso)
        })
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

    async setActiveMarker (asso, idx) {
      this.asso = asso
      const postalAddress = asso.fullAddress
      this.center = [0, 0]
      const coord = await getCoordinatesFromPostalAddress(postalAddress)
      this.activeResultIndex = idx
      this.center = coord
      this.markers = [{ coordinates: coord, asso }]
      this.query = asso.text
    },

    actionWithMarker (marker) {
      console.log('marker', marker.id)
      this.asso = marker.asso
    },
  },
})
</script>

<template>
  <h1 class="fr-container">
     où se trouve l'association ?
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
            v-for="(asso, idx) of results"
            :key="idx"
            class="search-result"
            :class="{ active: idx === activeResultIndex }"
            @click="setActiveMarker(asso, idx)"
          >
            {{ asso.text }}
          </li>
        </ul>
      </div>
    </div>
    <div class="carto-container">
      <div class="asso-info">
        Informations sur l'association :
        <template v-if="asso">
          <h4>
            {{ asso.title }} <span class="small">({{ asso.id }})</span>
          </h4>
          <h6>
            {{ asso.objet }}
          </h6>
          <p class="fr-mb-0">
            {{ asso.address.numeroVoie }} {{ asso.address.typeVoie }} {{ asso.address.voie }}
          </p>
          <p>{{ asso.address.cp }} {{ asso.address.commune }}</p>
          <a :href="asso.site">{{ asso.site }}</a>
        </template>
      </div>
      <div class="map">
        <AssoMap
          :center="center"
          :markers="markers"
          @click:marker="actionWithMarker($event)"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.small {
  color: var(--grey-850-200);
  font-weight: normal;
  font-size: 0.75em;
  font-style: italic;
}
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
  background-color: var(--grey-50-1000);
  cursor: pointer;
  color: var(--grey-1000-50);
  font-weight: 700;
}
.search-result:hover::before,
.search-result.active::before {
  content: "> ";
  color: var(--grey-1000-50);
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
