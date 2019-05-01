<template>
  <v-container grid-list-md fill-height fluid ma-0>
    <v-layout wrap row>
      <v-flex xs12>
        <v-layout row wrap align-content-center>          
          <v-flex xs3>
            <v-breadcrumbs divider="/">
              <v-breadcrumbs-item>
                Proveedores
              </v-breadcrumbs-item>
              <v-breadcrumbs-item>
                Listado
              </v-breadcrumbs-item>
            </v-breadcrumbs>
          </v-flex>
          <v-flex xs9 class="text-xs-right">
            <v-btn fab small color="success">
              <v-icon small>fa-plus</v-icon>
            </v-btn>
            <v-btn fab small color="accent">
              <v-icon small>fa-cloud-upload-alt</v-icon>
            </v-btn>
            <v-btn fab small color="accent">
              <v-icon small>fa-cloud-download-alt</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 px-2>
        <v-toolbar class="elevation-2">
          <v-flex xs12>
            <v-text-field
              full-width
              color="grey"
              label="Buscar proveedor"
              append-icon="search"
              @click:append="searchProveedor"
            ></v-text-field>
          </v-flex>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="proveedores"
          class="elevation-1"
          :total-items="page.totalElements"
          :pagination.sync="pagination"
          :rows-per-page-items="pageSizes"
          rows-per-page-text="Tamaño de página"
        >
          <template v-slot:items="{ item }">
            <td>{{ item.idProveedor }}</td>
            <td class="text-xs-right">
              {{ item.nombre }}
            </td>
            <td class="text-xs-right">
              {{ optional(item.cuenta).nroCuenta || "No existe" }}
            </td>
            <td class="text-xs-right">
              {{ item.tipoProveedor }}
            </td>
            <td class="text-xs-right">
              {{ optional(item.direccion).nombreCalle }}, {{ optional(item.direccion).ciudad }}
              </td>
            <td class="text-xs-right">
              {{ optional(item.contacto).nombre }} {{ optional(item.contacto).apellido }}
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
  
</template>

<script>
import { mapState } from 'vuex';
export default {
  async fetch ({ store }) {
    store.dispatch('loadCurrentTitle', 'Proveedores');
    
    const params = { requestPage: 0, size: 20, sortBy: undefined };

    await store.dispatch('proveedores/fetchProveedores', params)
  },
  data() {
    return {
      title: 'Proveedores',
      headers: [
        {
          text: 'Id Proveedor',
          align: 'left',
          sortable: false,
          value: 'idProveedor'
        },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Cuenta', value: 'cuenta' },
        { text: 'Direccion', value: 'direccion' },
        { text: 'Tipo', value: 'tipoProveedor' },
        { text: 'Contacto', value: 'contacto' }
      ],
      pagination: {
        descending: false,
        page: 0,
        rowsPerPage: 20,// -1 for All",
        sortBy: 'cuenta'
      },
      pageSizes: [20, 30, 50, 100]
    }
  },
  watch: {
    pagination: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        
        const params = { 
          requestPage: page -1, 
          size: rowsPerPage, 
          sortBy,
          descending
        };

        await this.$store.dispatch('proveedores/fetchProveedores', params);
      }
    }
  },
  computed: {
    ...mapState('proveedores', [
      'proveedores',
      'page'
    ])
  },
  methods: {
    searchProveedor() {
      console.log('searching')
    },
    optional(object) {
      return object || {};
    }
  },
}
</script>