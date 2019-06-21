<template>
  <simple-table-layout>
    <template #title>
      <h1>Empaques</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddBatchDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo Empaque</span>
      </v-btn>
    </template>
    <template #filters>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        box
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
    </template>
    <template #table>
      <v-data-table
        must-sort
        :headers="headers"
        :items="batches"
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
            <td class="text-xs-left">{{ props.item.nativeId || "Sin identificador" }}</td>
            <td class="text-xs-left">{{ formatDate(props.item.entryDate) }}</td>
            <td class="text-xs-left">{{ formatDate(props.item.expirationDate) }}</td>
            <td class="text-xs-left">{{ $_.get(props.item.purchase, "nativeId", "Sin compra") }}</td>
            <td class="text-xs-left">{{ $_.get(props.item.type, "description", "Sin tipo") }}</td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover left>
                <template v-slot:activator>
                  <v-btn color="secondary" dark fab small>
                    <v-icon small>fa-wrench</v-icon>
                  </v-btn>
                </template>
                <v-btn
                  class="mx-1"
                  color="accent"
                  dark
                  fab
                  small
                  @click.stop="openEditBatchDialog(props.item)"
                >
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn
                  class="mx-1"
                  color="deep-purple darken-2"
                  dark
                  fab
                  small
                  @click.stop="deleteBatch(props.item)"
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
      <save-batch-dialog
        v-model="openSaveDialog"
        :batch="batchToSave"
        :mode="dialogMode"
      ></save-batch-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveBatchDialog from "@/components/batches/SaveBatchDialog";
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Empaque", link: "/almacen/empaques" }
    ]
  },
  components: {
    EmptyListTile,
    SaveBatchDialog
  },
  async fetch({ store }) {
  },
  data() {
    return {
      title: "Empaques",
      headers: [
        { text: "Id Local", align: "left", value: "nativeId" },
        { text: "Fecha de Entrada", align: "left", value: "entryDate" },
        { text: "Fecha de Vencimiento", align: "left", value: "expirationDate" },
        { text: "Orden de Compra", align: "left", value: "purchase" },
        { text: "Tipo", align: "left", value: "type" },
        { text: "Acciones", align: "center", value: "id", width: "10%", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      search: "",
      filter: "nativeId:{}*,purchase.nativeId:{}*,type.description:{}*",
      expand: false,
      pageSizes: [20, 30, 50, 100],
      batchToSave: {},
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
        await this.$store.dispatch("batches/fetchBatches", params);
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
        await this.$store.dispatch("batches/fetchBatches", params);
      }
    }
  },
  computed: {
    ...mapState("batches", ["batches", "page"])
  },
  methods: {
    ...mapActions("batches", {
      deleteBatchAction: "deleteBatch"
    }),
    formatDate(date) {
      if (date != undefined) return this.dateMoment(date).format("DD/MM/YYYY");
      return "";
    },
    dateMoment(date) {
      if (date != undefined) {
        const momentDate = moment(date);
        return momentDate.isValid() ? momentDate : moment.now();
      }
      return "";
    },
    openAddBatchDialog() {
      this.openSaveDialog = true;
      this.batchToSave = {};
      this.dialogMode = "nuevo";
    },
    openEditBatchDialog(batch) {
      this.openSaveDialog = true;
      this.batchToSave = batch;
      this.dialogMode = "editar";
    },
    async deleteBatch(batch) {
      try {
        const { nativeId } = batch;
        const res = await this.$confirm(
          `¿Está seguro de borrar el empaque '${nativeId}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteBatchAction({ batch });
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

