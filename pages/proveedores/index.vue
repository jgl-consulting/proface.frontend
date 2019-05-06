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
          :items="suppliers"
          class="elevation-1"
          :total-items="page.totalElements"
          :pagination.sync="pagination"
          :rows-per-page-items="pageSizes"
          rows-per-page-text="Tamaño de página"
        >
          <template v-slot:items="{ item }">
            <td>{{ item.id }}</td>
            <td class="text-xs-right">
              {{ item.name }}
            </td>
            <td class="text-xs-right">
              {{ item.address }}
            </td>
            <td class="text-xs-right">
              {{ item.type.name }}
            </td>
            <td class="text-xs-right">
              {{ optional(item.contact).firstName }} {{ optional(item.contact).lastName }}
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

    await store.dispatch('suppliers/fetchSuppliers', params)
  },
  data() {
    return {
      title: 'Proveedores',
      headers: [
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Nombre', value: 'name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Tipo', value: 'type' },
        { text: 'Contacto', value: 'contact' }
      ],
      pagination: {
        descending: false,
        page: 0,
        rowsPerPage: 20,// -1 for All",
        sortBy: 'id'
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

        await this.$store.dispatch('suppliers/fetchSuppliers', params);
      }
    }
  },
  computed: {
    ...mapState('suppliers', [
      'suppliers',
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