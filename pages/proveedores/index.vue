<template>
  <v-container>
    <v-layout wrap row>
      <v-flex xs12>
        <v-layout row wrap align-content-center mb-3>          
          <v-flex xs6>
            <module-title>
              Listado de proveedores
            </module-title>
          </v-flex>
          <v-flex xs6 class="text-xs-right">
            <v-btn class="mt-3" fab small color="success" @click="openAddSupplierDialog">
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
      <v-flex xs12>
        <!-- <v-toolbar class="elevation-2">
          <v-flex xs12>
            <v-text-field
              full-width
              color="grey"
              label="Buscar proveedor"
              append-icon="search"
              @click:append="searchProveedor"
            ></v-text-field>
          </v-flex>
        </v-toolbar> -->
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
            <tr @click.stop="props.expanded = !props.expanded">
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
              <td class="text-xs-center">
                <v-btn class="mx-1" color="primary" dark fab small
                  @click.stop="supplierDetails(props.item)">
                  <v-icon small>fa-ellipsis-v</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="accent" dark fab small
                  @click.stop="openEditSupplierDialog(props.item)">
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="deep-purple darken-3" dark fab small
                  @click.stop="deleteSupplier(props.item)">
                  <v-icon small>fa-trash</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-slot:expand="{ item }">
            <v-list avatar>
              <div v-if="$_.isEmpty(item.accounts)">
                <empty-list-tile>
                  No hay cuentas para el proveedor.
                </empty-list-tile>
              </div>
              <div v-else> 
                <account-list-item
                  class="my-3"
                  v-for="account in item.accounts"
                  :key="account | accountFlatId"
                  :description="account.description"
                  :number="account.number"
                  :cci="account.cci"
                  :bank="account.bank"
                  :currency="account.currency"
                >
                </account-list-item>
              </div>
            </v-list>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <save-supplier-dialog
      v-model="openSaveDialog"
      :supplier="supplierToSave"
      :mode="dialogMode"
      @save="saveSupplier"
    ></save-supplier-dialog>
  </v-container>
</template>

<script>
import EmptyListTile from '@/components/common/EmptyListTile';
import AccountListItem from '@/components/suppliers/AccountListItem';
import SaveSupplierDialog from '@/components/suppliers/SaveSupplierDialog';
import { mapState } from 'vuex';

export default {
  components: {
    AccountListItem,
    EmptyListTile,
    SaveSupplierDialog
  },
  async fetch ({ store }) {
    let array = [1,2,3,4];
    
    const params = { requestPage: 0, size: 20, sortBy: undefined };
    await store.dispatch('suppliers/fetchSuppliers', params);
    await store.dispatch('suppliers/fetchSupplierTypes');
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
        { text: 'Acciones', value: 'id', sortable: false,}
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20,// -1 for All",
        sortBy: 'id'
      },
      expand: false,
      pageSizes: [20, 30, 50, 100],
      supplierToSave: {
        type: { id: 0 },
        country: { id: 0 },
        contact: { id: 0 }
      },
      openSaveDialog: false,
      dialogMode: 'nuevo'
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
    supplierDetails(supplier) {
      const { path } = this.$route;
      this.$router.push({
        path: `${path}/${supplier.id}`
      })
    },
    openAddSupplierDialog() {
      this.openSaveDialog = true;
      this.supplierToSave = {
        type: { id: 0 },
        country: { id: 0 },
        contact: { id: 0 }
      };
      this.dialogMode = 'nuevo';
    },
    openEditSupplierDialog(supplier) {
      this.openSaveDialog = true;
      this.supplierToSave = supplier;
      this.dialogMode = 'editar';
    },
    saveSupplier(supplier) {
      console.log(supplier);
    },
    deleteSupplier(supplier){
    },
    optional(object) {
      return object || {};
    },
  },
  filters: {
    accountFlatId({ id }) {
      return `${id}`;
    }
  }
}
</script>