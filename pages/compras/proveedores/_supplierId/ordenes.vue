<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Órdenes de Compra</v-subheader>
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
        :headers="purchaseHeaders"
        :items="purchases"
        class="elevation-1"
        :expand="expand"
        item-key="id"
        :total-items="page.totalElements"
        :pagination.sync="pagination"
        :rows-per-page-items="pageSizes"
        rows-per-page-text="Tamaño de página"
        must-sort
      >
        >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.nativeId || "Sin identificador" }}</td>
            <td class="text-xs-left">{{ formatDate(props.item.creationDate) }}</td>
            <td class="text-xs-left">{{ $_.get(props.item.currency, "symbol", "S/.") + ' ' + props.item.total }}</td> 
            <td class="text-xs-left">{{ 'S/. ' + props.item.localTotal }}</td>             
            <td class="text-xs-left">{{ 'S/. ' + props.item.localCost }}</td>
            <td class="text-xs-left">
              <v-icon :color='$_.get(props.item.status, "color", "primary")' small>{{$_.get(props.item.status, "icon", "fa fa-calendar")}}</v-icon>
              - {{ $_.get(props.item.status, "description", "Sin estado")}}
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  async fetch({ params: { supplierId }, route, store }) {
    //const params = { requestPage: 0, size: 20, sortBy: undefined };
    await store.dispatch("suppliers/details/fetchSupplier", { supplierId });
    //await store.dispatch("suppliers/details/fetchPurchaseOrders", params);
  },
  components: {
    EmptyListTile
  },
  data() {
    return {
      title: "Órdenes de Compra",
      purchaseHeaders: [
        { text: "Id Local", value: "nativeId" },
        { text: "Fecha de Emisión", value: "creationDate" },
        { text: "Total", value: "total"},
        { text: "Total en Soles", value: "localTotal"},
        { text: "Costos en Soles", value: "localCost"},
        { text: "Estado", value: "status" }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      search: "",
      filter: "nativeId:{}*,status.description:{}*,¬",
      expand: false,
      pageSizes: [20, 30, 50, 100]
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
          "suppliers/details/fetchPurchaseOrders",
          params
        );
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
        await this.$store.dispatch(
          "suppliers/details/fetchPurchaseOrders",
          params
        );
      }
    }
  },
  computed: {
    ...mapState("suppliers/details", ["purchaseOrders", "page"]),
    purchases() {
      return this.purchaseOrders || [];
    }
  },
  methods: {
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
    optional(object) {
      return object || {};
    }
  }
};
</script>
