<template>
  <v-dialog v-model="value" persistent width="900">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">
          Listado de productos
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-data-table
              :headers="headers"
              :items="products"
              :expand="expand"
              item-key="id"
              :total-items="page.totalElements"
              :pagination.sync="pagination"
              :rows-per-page-items="pageSizes"
              rows-per-page-text="Tamaño de página">
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
                      {{ props.item.description }}
                  </td>
                  <td class="text-xs-right">
                    {{ props.item.line.name }}
                  </td>
                  <td class="text-xs-center">
                    <v-btn flat icon color="accent" @click.stop="emitProduct(props.item)">
                      <v-icon small>fa-plus-circle</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    products: Array,
    page: Object
  },
  data: () => ({
    isOpen: false,
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'id'
      },
      { text: 'Id Local', value: 'nativeId' },
      { text: 'Nombre', value: 'name' },
      { text: 'Descripción', value: 'description' },
      { text: 'Línea', value: 'line' },
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
      productToSave: {
        line: { id: 0 }
      },
      openSaveDialog: false,
      dialogMode: 'nuevo'
  }),
  watch: {
    pagination: {
      async handler() {
        this.$emit('changePagination', this.pagination);
      }
    }
  },
  methods: {
    closeDialog() {
      this.isOpen = false;
      this.$emit("input", this.isOpen);
    },
    emitProduct(product) {
      this.$emit('selectedProduct', product);
      this.closeDialog();
    }
  },
  created(){
    this.isOpen = this.value;
  }
}
</script>

<style>

</style>
