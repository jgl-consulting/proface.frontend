<template>
  <simple-table-layout>
    <template #title>
      <h1>Productos</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddProductDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo Producto</span>
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
        rows-per-page-text="Tamaño de página"
      >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.nativeId }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-left">{{ props.item.currency.symbol}} {{ props.item.salePrice | twoDecimals }}</td>
            <td class="text-xs-left">S/.{{ props.item.localPrice | twoDecimals }}</td>
            <td class="text-xs-left">{{ props.item.totalStock }}</td>
            <td class="text-xs-left">{{ props.item.totalStock - props.item.avaliableStock }}</td>
            <td class="text-xs-left">{{ props.item.avaliableStock }}</td>
            <td class="text-xs-left">{{ props.item.line.name }}</td>
            <td class="text-xs-left" @click.stop="() => {}">
              <!--v-btn
                class="mx-1"
                color="primary"
                dark
                icon
                flat
                small
                nuxt
                :to="props.item.id | path($route.fullPath)"
              >
                <v-icon small>fa-ellipsis-v</v-icon>
              </v-btn-->
              <v-btn
                class="mx-1"
                color="accent"
                dark
                icon
                flat
                small
                @click.stop="openEditProductDialog(props.item)"
              >
                <v-icon small>fa-pen</v-icon>
              </v-btn>
              <v-btn
                class="mx-1"
                color="deep-purple darken-2"
                dark
                icon
                flat
                small
                @click.stop="deleteProduct(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-product-dialog v-model="openSaveDialog" :product="productToSave" :mode="dialogMode"></save-product-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveProductDialog from "@/components/products/SaveProductDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Productos", link: "/compras/productos" }
    ]
  },
  components: {
    EmptyListTile,
    SaveProductDialog
  },
  async fetch({ store }) {
    //const params = { requestPage: 0, size: 20, sortBy: undefined };
    //await store.dispatch("products/fetchProducts", params);
    await store.dispatch("products/fetchProductLines");
    await store.dispatch("products/fetchCurrencies");
  },
  data() {
    return {
      title: "Productos",
      headers: [
        { text: "Id Local", value: "nativeId" },
        { text: "Nombre", value: "name" },
        { text: "Descripción", value: "description" },
        { text: "Precio de Venta", value: "salePrice" },
        { text: "Precio en Soles", value: "localPrice" },
        { text: "Total", value: "totalStock" },
        { text: "Separado", value: "totalStock" },
        { text: "Disponible", value: "avaliableStock" },
        { text: "Línea", value: "line" },
        { text: "Acciones", value: "id", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      pageSizes: [20, 30, 50, 100],
      productToSave: {
        line: { id: 0 },
        currency: { id: 0 }
      },
      openSaveDialog: false,
      dialogMode: "nuevo"
    };
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
        await this.$store.dispatch("products/fetchProducts", params);
      }
    }
  },
  computed: {
    ...mapState("products", ["products", "page"])
  },
  methods: {
    ...mapActions("products", {
      deleteProductAction: "deleteProduct"
    }),
    openAddProductDialog() {
      this.openSaveDialog = true;
      this.productToSave = {
        line: { id: 0 },
        currency: { id: 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditProductDialog(product) {
      this.openSaveDialog = true;
      this.productToSave = product;
      this.dialogMode = "editar";
    },
    async deleteProduct(product) {
      try {
        const { name } = product;
        const res = await this.$confirm(
          `¿Está seguro de borrar el producto '${name}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteProductAction({ product });

          await this.$confirm("Borrado correcto!", {
            title: "Éxito",
            color: "success"
          });
        }
      } catch (error) {
        this.showError(error);
      }
    },
    optional(object) {
      return object || {};
    },
    showError(error) {
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    }
  },
  filters: {
    path: (param, path) => `${path}/${param}`
  }
};
</script>