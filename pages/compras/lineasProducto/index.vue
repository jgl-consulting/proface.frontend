<template>
  <simple-table-layout>
    <template #title>
      <h1>Líneas de Producto</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddProductLineDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nueva Línea</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="productLines"
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
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-btn
                class="mx-1"
                color="accent"
                dark
                icon
                flat
                small
                @click.stop="openEditProductLineDialog(props.item)"
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
                @click.stop="deleteProductLine(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-product-line-dialog
        v-model="openSaveDialog"
        :product-line="productLineToSave"
        :mode="dialogMode"
      ></save-product-line-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveProductLineDialog from "@/components/productLines/SaveProductLineDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Líneas de Producto", link: "/lineasProducto" }
    ]
  },
  components: {
    EmptyListTile,
    SaveProductLineDialog
  },
  async fetch({ store }) {
    //const params = { requestPage: 0, size: 20, sortBy: undefined };
    //await store.dispatch("productLines/fetchProductLines", params);
  },
  data() {
    return {
      title: "Líneas de Producto",
      headers: [
        { text: "Nombre", align: "left", value: "name" },
        { text: "Acciones", align: "center", value: "id", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      pageSizes: [20, 30, 50, 100],
      productLineToSave: {},
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
        await this.$store.dispatch("productLines/fetchProductLines", params);
      }
    }
  },
  computed: {
    ...mapState("productLines", ["productLines", "page"])
  },
  methods: {
    ...mapActions("productLines", {
      deleteProductLineAction: "deleteProductLine"
    }),
    openAddProductLineDialog() {
      this.openSaveDialog = true;
      this.productLineToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditProductLineDialog(productLine) {
      this.openSaveDialog = true;
      this.productLineToSave = productLine;
      this.dialogMode = "editar";
    },
    async deleteProductLine(productLine) {
      try {
        const { name } = productLine;
        const res = await this.$confirm(
          `¿Está seguro de borrar la línea '${name}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteProductLineAction({ productLine });
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
  }
};
</script>

