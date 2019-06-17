<template>
  <simple-table-layout>
    <template #title>
      <h1>Tipos de Empaque</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddBatchTypeDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo Tipo de Empaque</span>
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
        :items="batchTypes"
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
            <td class="text-xs-left">{{ props.item.description || "Sin descripción" }}</td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover left>
                <template v-slot:activator>
                  <v-btn color="secondary" dark icon flat small>
                    <v-icon small>fa-wrench</v-icon>
                  </v-btn>
                </template>
                <v-btn
                  class="mx-1"
                  color="accent"
                  dark
                  icon
                  flat
                  small
                  @click.stop="openEditBatchTypeDialog(props.item)"
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
                  @click.stop="deleteBatchType(props.item)"
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
      <save-batch-type-dialog
        v-model="openSaveDialog"
        :batchType="batchTypeToSave"
        :mode="dialogMode"
      ></save-batch-type-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveBatchTypeDialog from "@/components/batchTypes/SaveBatchTypeDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Tipos de Empaque", link: "/almacen/tiposEmpaque" }
    ]
  },
  components: {
    EmptyListTile,
    SaveBatchTypeDialog
  },
  async fetch({ store }) {
  },
  data() {
    return {
      title: "Tipos de Empaque",
      headers: [
        { text: "Descripción", align: "left", value: "description" },
        { text: "Acciones", align: "center", value: "id", width: "10%", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      search: "",
      filter: "description:{}*",
      pageSizes: [20, 30, 50, 100],
      batchTypeToSave: {},
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
        await this.$store.dispatch("batchTypes/fetchBatchTypes", params);
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
        await this.$store.dispatch("batchTypes/fetchBatchTypes", params);
      }
    }
  },
  computed: {
    ...mapState("batchTypes", ["batchTypes", "page"])
  },
  methods: {
    ...mapActions("batchTypes", {
      deleteBatchTypeAction: "deleteBatchType"
    }),
    openAddBatchTypeDialog() {
      this.openSaveDialog = true;
      this.batchTypeToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditBatchTypeDialog(batchType) {
      this.openSaveDialog = true;
      this.batchTypeToSave = batchType;
      this.dialogMode = "editar";
    },
    async deleteBatchType(batchType) {
      try {
        const { description } = batchType;
        const res = await this.$confirm(
          `¿Está seguro de borrar el tipo '${description}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteBatchTypeAction({ batchType });
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

