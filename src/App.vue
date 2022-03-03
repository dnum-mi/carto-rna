<template>
  <DsfrHeader
    :logo-text="['Ministère', 'de l’intérieur']"
    service-title="Associations - RNA"
  />
  <nav class="fr-container">
    <router-link to="/">
      Accueil
    </router-link> |
    <router-link to="/contact">
      Contact
    </router-link>
  </nav>
  <router-view />
</template>
