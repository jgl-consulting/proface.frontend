<template>
  <simple-table-layout>
    <template #title>
      <h1>Órdenes de Compra</h1>
    </template>
    <template #actions>
      <v-btn color="accent" to="/compras/ordenesCompra/nueva" nuxt>
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nueva orden de compra</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="purchaseOrders"
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
            <td class="text-xs-left">{{ formatDate(props.item.creationDate) }}</td>
            <td class="text-xs-left">{{ props.item.supplier.name }}</td>
            <td class="text-xs-left">{{ props.item.currency.symbol + ' ' + props.item.total }}</td>
            <td class="text-xs-left">{{ 'S/. ' + props.item.localTotal }}</td>
            <td class="text-xs-left">
              <v-icon :color="getColor(props.item.status)" small>{{getIcon(props.item.status)}}</v-icon>
              - {{props.item.status.description}}
            </td>
            <td class="text-xs-left" @click.stop="() => {}">
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
                @click.stop="openEditPurchaseOrderDialog(props.item)"
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
                @click.stop="deletePurchaseOrder(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SavePurchaseOrderDialog from "@/components/purchaseOrders/SavePurchaseOrderDialog";
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Órdenes de Compra", link: "/compras/ordenesCompra" }
    ]
  },
  components: {
    EmptyListTile,
    SavePurchaseOrderDialog
  },
  async fetch({ store }) {
    //const params = { requestPage: 0, size: 20, sortBy: undefined };
    //await store.dispatch("purchaseOrders/fetchPurchaseOrders", params);
  },
  data() {
    return {
      title: "Órdenes de Compra",
      headers: [
        { text: "Id Local", value: "nativeId" },
        { text: "Fecha de Emisión", value: "creationDate" },
        { text: "Proveedor", value: "supplier" },
        { text: "Total", value: "total" },
        { text: "Total en Soles", value: "localTotal" },
        { text: "Estado", value: "status" },
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
      purchaseOrderToSave: {
        status: { id: 0 },
        supplier: { id: 0 }
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
        await this.$store.dispatch(
          "purchaseOrders/fetchPurchaseOrders",
          params
        );
      }
    }
  },
  computed: {
    ...mapState("purchaseOrders", ["purchaseOrders", "page"])
  },
  methods: {
    ...mapActions("purchaseOrders", {
      deletePurchaseOrderAction: "deletePurchaseOrder"
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
    openAddPurchaseOrderDialog() {
      this.openSaveDialog = true;
      this.purchaseOrderToSave = {
        status: { id: 0 },
        supplier: { id: 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditPurchaseOrderDialog(purchaseOrder) {
      this.openSaveDialog = true;
      this.purchaseOrderToSave = purchaseOrder;
      this.dialogMode = "editar";
    },
    async deletePurchaseOrder(purchaseOrder) {
      try {
        const { nativeId } = purchaseOrder;
        const res = await this.$confirm(
          `¿Está seguro de borrar la orden de compra '${nativeId}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deletePurchaseOrderAction({ purchaseOrder });

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
    },
    getColor(status) {
      return status.color || "primary";
    },
    getIcon(status) {
      return status.icon || "fa fa-calendar";
    }
  },
  filters: {
    path: (param, path) => `${path}/${param}`
  }
};
</script>
