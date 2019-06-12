<template>
  <div>
    <v-layout wrap row mb-2>
      <slot name="title"></slot>
      <v-spacer></v-spacer>
      <slot name="actions"></slot>
    </v-layout>
    <v-layout wrap row>
      <slot name="filters"></slot>
    </v-layout>
    <v-layout wrap row mt-1>
      <v-flex xs12>
        <slot name="table"></slot>
      </v-flex>
      <slot name="dialog"></slot>
    </v-layout>
  </div>
</template>
<style>
  tr > th {
    text-transform: uppercase !important;
  }
  table.v-table thead th, table.v-table tbody td {    
    font-size: 11px;
  }
</style>