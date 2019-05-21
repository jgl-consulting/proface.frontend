<template>
  <div>
    <v-layout py-2 px-0 row wrap>
      <v-subheader class="px-2">
        <slot name="title"></slot>
      </v-subheader>
      <v-spacer></v-spacer>
      <slot name="actions"></slot>
    </v-layout>
    <v-layout row wrap>
      <slot name="controls"></slot>
    </v-layout>  
  </div>
</template>
