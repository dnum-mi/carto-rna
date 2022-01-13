const express = require('express')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express()

const port = 3010

const swaggerDocument = YAML.load('./swagger.yaml')

app.get('/search', function searchController (req, res) {
  const { q, sort, desc, limit: limitAsString, fuzzy_search: fuzzySearch } = req.query
  if (!q) {
    res.status(400).json({
      erreur: {
        message: 'Le paramètre q est requis',
        code: 1,
      }
    })
  }
  const limit = Number(limitAsString)
  if (!limit || !Number.isInteger(limit) || !Number.isFinite(limit || limit > 0)) {
    res.status(400).json({
      erreur: {
        message: 'Le paramètre `limit` doit être un entier positif',
        code: 1,
      }
    })
  }
  res.json({
    "associations": {
      "id_association": "W751207013",
      "is_waldec": true,
      "numero_rup": "",
      "themes": "",
      "nature": "D",
      "groupement": "simple",
      "titre": {
        "long": "ACBB CLUB DES SUPPORTERS",
        "court": "ACBB CLUB DES SUPPORTERS"
      },
      "objet": "promouvoir et favoriser les activités sportives de lÂACBB",
      "objet_social": 11192,
      "adresse_siege": {
        "libelle": "",
        "numero_voie": 35,
        "type_voie": "RUE",
        "libelle_voie": "le Marois",
        "distribution": "",
        "code_postal": 75016,
        "libelle_commune": "Paris",
        "code_insee": 75116
      },
      "adresse_declarant": {
        "libelle": "",
        "format_postal": "ETAGE 7",
        "libelle_voie": "35  rue le Marois",
        "distribution": "",
        "code_postal": 75016,
        "acheminement": "Paris",
        "pays": "FRANCE"
      },
      "type_dirigeant": "PM",
      "site_web": "",
      "autorisation_publication_web": false,
      "observation": "",
      "etat": "active",
      "date_creation": "2010-10-21T00:00:00.000Z",
      "date_publication": "2010-11-06T00:00:00.000Z",
      "date_declaration_dissolution": "",
      "date_derniere_declaration": "2010-10-21T00:00:00.000Z",
      "derniere_maj": "2010-11-15T16:47:13.633Z"
    },
    "nombre": 1
  })
})

app.get('/healthcheck', function  (req, res) {
  res.json({
    "statut": {
      "etat": "OK",
      "base": {
        "taille": "Unknown"
      },
      "date": new Date()
    }
  })
})

app.get('/:id', function searchById (req, res) {
  res.json({
    "associations": {
      "id_association": "W751207013",
      "is_waldec": true,
      "numero_rup": "",
      "themes": "",
      "nature": "D",
      "groupement": "simple",
      "titre": {
        "long": "ACBB CLUB DES SUPPORTERS",
        "court": "ACBB CLUB DES SUPPORTERS"
      },
      "objet": "promouvoir et favoriser les activités sportives de lÂACBB",
      "objet_social": 11192,
      "adresse_siege": {
        "libelle": "",
        "numero_voie": 35,
        "type_voie": "RUE",
        "libelle_voie": "le Marois",
        "distribution": "",
        "code_postal": 75016,
        "libelle_commune": "Paris",
        "code_insee": 75116
      },
      "adresse_declarant": {
        "libelle": "",
        "format_postal": "ETAGE 7",
        "libelle_voie": "35  rue le Marois",
        "distribution": "",
        "code_postal": 75016,
        "acheminement": "Paris",
        "pays": "FRANCE"
      },
      "type_dirigeant": "PM",
      "site_web": "",
      "autorisation_publication_web": false,
      "observation": "",
      "etat": "active",
      "date_creation": "2010-10-21T00:00:00.000Z",
      "date_publication": "2010-11-06T00:00:00.000Z",
      "date_declaration_dissolution": "",
      "date_derniere_declaration": "2010-10-21T00:00:00.000Z",
      "derniere_maj": "2010-11-15T16:47:13.633Z"
    },
    "nombre": 1
  })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
