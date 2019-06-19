<template>
  <simple-table-layout>
    <template #title>
      <h1>Productos</h1>
    </template>
    <template #actions>
      <v-btn color="indigo darken-3" dark>
        <v-icon small>fa-file-pdf</v-icon>
        <span class="mx-1">Descargar Lista</span>
      </v-btn>
      <v-btn color="accent" @click="openAddProductDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nuevo Producto</span>
      </v-btn>
      <v-btn color="red darken-2" dark :href="exportURL" target="_blank">
        <v-icon small>fa-file-pdf</v-icon>
        <span class="mx-1"></span>
        <span>Ver PDF</span>
      </v-btn>
    </template>
    <template #filters>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
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
        must-sort
      >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.nativeId || "Sin identificador" }}</td>
            <td class="text-xs-left">{{ props.item.name || "Sin nombre" }}</td>
            <!--td class="text-xs-left">{{ props.item.description || "Sin descripcíon" }}</td-->
            <td class="text-xs-left">{{ $_.get(props.item.currency, "symbol", "S/.") }} {{ props.item.salePrice | twoDecimals }}</td>
            <td class="text-xs-left">S/. {{ props.item.localPrice | twoDecimals }}</td>
            <td class="text-xs-left">{{ props.item.totalStock }}</td>
            <td class="text-xs-left">{{ props.item.totalStock - props.item.avaliableStock }}</td>
            <td class="text-xs-left">{{ props.item.avaliableStock }}</td>
            <td class="text-xs-left">{{ $_.get(props.item.line, "name", "Sin línea") }}</td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover left>
                <template v-slot:activator>
                  <v-btn color="secondary" dark icon flat small>
                    <v-icon small>fa-wrench</v-icon>
                  </v-btn>
                </template>
                <v-btn
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
                </v-btn>
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
              </v-speed-dial>
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
        //{ text: "Descripción", value: "description" },
        { text: "Precio de Venta", value: "salePrice", width:"5%" },
        { text: "Precio en Soles", value: "localPrice", width:"5%" },
        { text: "Total", value: "totalStock", width:"5%" },
        { text: "Separado", value: "totalStock", width:"5%" },
        { text: "Disponible", value: "avaliableStock", width:"5%" },
        { text: "Línea", value: "line" },
        { text: "Acciones", value: "id", width:"10%", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      search: "",
      filter: "nativeId:{}*,name:{}*,description:{}*,line.name:{}*",
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
    },
    search: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        let searchFilter = this.search ? this.filter.replace(/{}/g, this.search) : "";
        const params = {
          requestPage: page - 1,
          size: rowsPerPage,
          sortBy,
          descending,
          filter: searchFilter
        };
        await this.$store.dispatch("products/fetchProducts", params);
      }
    }
  },
  computed: {
    ...mapState("products", ["products", "page"]),
    exportURL() {
      return `${this.$axios.defaults.baseURL}/api/products/reports`;
    }
  },
  methods: {
    ...mapActions("products", {
      deleteProductAction: "deleteProduct",
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