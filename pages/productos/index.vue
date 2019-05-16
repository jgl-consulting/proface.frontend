<template>
  <div>
    <simple-table-layout>
      <template #title>
        Productos
      </template>
      <template #actions>
        <v-btn color="accent" @click="openAddProductDialog">
          <v-icon small>fa-plus</v-icon>
          <span class="mx-1"></span>
          <span>Nuevo producto</span>
        </v-btn>
      </template>
      <template #table>
        <v-data-table
          :headers="headers"
          :items="products"
          :expand="expand"
          item-key="id"
          class="elevation-1"
          :total-items="page.totalElements"
          :pagination.sync="pagination"
          :rows-per-page-items="pageSizes"
          rows-per-page-text="Tamaño de página" >
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
                {{ props.item.salePrice }}
              </td>
              <td class="text-xs-right">
                {{ props.item.line.name }}
              </td>
              <td class="text-xs-center" @click.stop="() => {}">
                <v-btn class="mx-1" color="primary" dark icon flat small
                  nuxt :to="props.item.id | path($route.fullPath)">>
                  <v-icon small>fa-ellipsis-v</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="accent" dark icon flat small
                  @click.stop="openEditProductDialog(props.item)">
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="deep-purple darken-3" dark icon flat small
                  @click.stop="deleteProduct(props.item)">
                  <v-icon small>fa-trash</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </template>
      <template #dialog>
        <save-product-dialog
          v-model="openSaveDialog"
          :product="productToSave"
          :mode="dialogMode"
          @save="saveProduct"
        ></save-product-dialog>
      </template>
    </simple-table-layout>
  </div>
</template>

<script>
import EmptyListTile from '@/components/common/EmptyListTile';
import SaveProductDialog from '@/components/products/SaveProductDialog';
import { mapState } from 'vuex';
export default {
  meta: {
    breadcrumbs: [
      { name: 'Módulos', link: '/' },
      { name: 'Producto', link: '/productos' },
    ]
  },
  components: {
    EmptyListTile,
    SaveProductDialog
  },
  async fetch ({ store }) {
    const params = { requestPage: 0, size: 20, sortBy: undefined };
    await store.dispatch('products/fetchProducts', params);
    await store.dispatch('products/fetchProductLines');
  },
  data() {
    return {
      title: 'Productos',
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
        { text: 'Precio de Venta', value: 'salePrice' },
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
        await this.$store.dispatch('products/fetchProducts', params);
      }
    }
  },
  computed: {
    ...mapState('products', [
      'products',
      'page'
    ])
  },
  methods: {
    productDetails(product) {
      const { path } = this.$route;
      this.$router.push({
        path: `${path}/${product.id}`
      })
    },
    openAddProductDialog() {
      this.openSaveDialog = true;
      this.productToSave = {
        line: { id: 0 }
      };
      this.dialogMode = 'nuevo';
    },
    openEditProductDialog(product) {
      this.openSaveDialog = true;
      this.productToSave = product;
      this.dialogMode = 'editar';
    },
    saveProduct(product) {
      console.log(product);
    },
    deleteProduct(product){
    },
    optional(object) {
      return object || {};
    },
  }
}
</script>