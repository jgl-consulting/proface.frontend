<template>
  <v-layout row wrap align-center>
    <v-flex sm2 px-4>
      <div class="text-sm-center">
        <v-icon :size="200">fa-lock</v-icon>
      </div>
    </v-flex>
    <v-flex sm10 pa-5>
      <h1 class="main-title">Whoops!</h1>
      <p class="main-content">
        Parece que no estás autorizado para acceder a este contenido. Si considera que esto es
        un error, por favor contacte con Soporte Técnico para configurar sus permisos.
      </p>
    </v-flex>
  </v-layout>
</template>
<style scoped>
.main-title {
  font-weight: bold;
  font-size: 100px;
}

.main-content {
  font-size: 25px;
}
</style>