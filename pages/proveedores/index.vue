<template>
  <v-container grid-list-md fill-height fluid ma-0>
    <v-layout wrap row>
      <v-flex xs12>
        <v-layout row wrap align-content-center>          
          <v-flex xs3>
            <!-- <v-breadcrumbs divider="/">
              <v-breadcrumbs-item>
                Proveedores
              </v-breadcrumbs-item>
              <v-breadcrumbs-item>
                Listado
              </v-breadcrumbs-item>
            </v-breadcrumbs> -->
          </v-flex>
          <v-flex xs9 class="text-xs-right">
            <v-btn fab small color="success">
              <v-icon small>fa-plus</v-icon>
            </v-btn>
            <!-- <v-btn fab small color="accent">
              <v-icon small>fa-cloud-upload-alt</v-icon>
            </v-btn>
            <v-btn fab small color="accent">
              <v-icon small>fa-cloud-download-alt</v-icon>
            </v-btn> -->
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
          :expand="expand"
          item-key="id"
          class="elevation-1"
          :total-items="page.totalElements"
          :pagination.sync="pagination"
          :rows-per-page-items="pageSizes"
          rows-per-page-text="Tamaño de página"
        >
          <template v-slot:items="props">
            <tr @click="props.expanded = !props.expanded">

              <td>{{ props.item.id }}</td>
              <td class="text-xs-right">
                {{ props.item.nativeId }}
              </td>
              <td class="text-xs-right">
                {{ props.item.name }} 
              </td>
              <td class="text-xs-right">
                {{ props.item.address }}
              </td>
              <td class="text-xs-right">
                <span class="mr-2">{{ props.item.country.name }}</span>
                <flag 
                  :iso="props.item.country.iso"
                  :title="props.item.country.name"
                  :squared="false"
                ></flag> 
              </td>
              <td class="text-xs-right">
                {{ props.item.type.name }}
              </td>
            </tr>
          </template>
          <template v-slot:expand="{ item }">
            <v-list avatar>
              <div v-if="$_.isEmpty(item.accounts)">
                <v-list-tile>
                  <v-list-tile-avatar>
                    <v-icon small class="yellow darken-3" color="white">
                      fa-search
                    </v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      No hay cuentas para el proveedor.
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </div>
              <div v-else> 
                <account-list-item
                  v-for="account in item.accounts"
                  :key="account | accountFlatId"
                  :description="account.description"
                  :number="account.number"
                  :cci="account.cci"
                  :bank="account.bank"
                  :currency="account.currency"
                ></account-list-item>
              </div>
            </v-list>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AccountListItem from '@/components/AccountListItem';

import { mapState } from 'vuex';

export default {
  components: {
    AccountListItem
  },
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
        { text: 'Id Local', value: 'nativeId' },
        { text: 'Nombre', value: 'name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Pais', value: 'country'},
        { text: 'Tipo', value: 'type' },
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20,// -1 for All",
        sortBy: 'id'
      },
      expand: false,
      pageSizes: [20, 30, 50, 100]
    }
  },
  watch: {
    pagination: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        
        const params = { 
          requestPage: page - 1, 
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
  filters: {
    accountFlatId({ id }) {
      return `${id}`;
    }
  }
}
</script>