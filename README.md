# Carto RNA

## Installer le projet

Cloner le projet, puis installer les dépendances :

```shell
npm install
```

## Pour tester : configurer les variables d'environnements

À la racine du projet, créer un fichier .env avec :

- pour l'usage d'un *bouchon* de test :


```
VITE_API_BASE_URL=http://localhost:3010/

VITE_API_BAN_URL=https://api-adresse.data.gouv.fr/search

VITE_API_ETABLISSEMENTS_PUBLICS_URL=https://etablissements-publics.api.gouv.fr/v3/
```
- sans utilisation d'un *bouchon* de test :


```
VITE_API_BASE_URL=https://<api.mi>/v1/associations/

VITE_API_BAN_URL=https://api-adresse.data.gouv.fr/search

VITE_API_ETABLISSEMENTS_PUBLICS_URL=https://etablissements-publics.api.gouv.fr/v3/

```
## Démarrer le front sans docker

Lancer le projet en mode développement avec la commande :

```shell
$ npm run dev
```

## Démarrer le swagger

Se placer dans le répertoire `swagger`

Lancer la commande
```shell
$ npm run dev
```

## Démarrer le front avec docker

Soit en remote container avec VS Code :

Démarrer simplement le projet dans un devcontainer (il faut l’extension remote container de Microsoft).

Soit en lançant la commande suivante :

```shell
docker-compose -f .docker/docker-compose-dev.yml up
```

## Lancer le projet en production

Il faut utiliser le docker-compose de production `.docker/docker-compose.yml`, ou
bien utiliser le Dockerfile en donnant au moins comme build-args `VITE_API_BASE_URL`
avec l’URL de l’API et `VITE_API_BAN_URL` pour l'URL de l'API BAN.
