<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Órdenes de Venta</v-subheader>
    </template>
    <template #actions>
      <v-btn v-if="$isAllowed('registerSale')" color="accent" to="/ventas/ordenesVenta/nuevaVenta" nuxt>
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nueva orden de venta</span>
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
        box
        single-line
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
    </template>
    <template #table>
      <v-data-table
        :headers="saleHeaders"
        :items="sales"
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
            <td class="text-xs-left">{{ 'S/. ' + props.item.localTotal }}</td>             
            <td class="text-xs-left">{{ $_.get(props.item.user, "firstName", "Sin vendedor") }}</td> 
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
import salePerimeter from '@/security/perimeters/sale-perimeter'

import moment from "moment";


export default {
  routePerimeterAction: 'viewSale',
  perimeters: [
    salePerimeter
  ],
  async fetch({ params: { clientId }, route, store }) {
    await store.dispatch("clients/details/fetchClient", { clientId });
  },
  components: {
    EmptyListTile
  },
  data() {
    return {
      title: "Órdenes de Venta",
      saleHeaders: [
        { text: "Id Local", value: "nativeId" },
        { text: "Fecha de Emisión", value: "creationDate" },
        { text: "Total en Soles", value: "localTotal"},
        { text: "Vendedor", value: "user"},
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
          "clients/details/fetchSaleOrders",
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
          "clients/details/fetchSaleOrders",
          params
        );
      }
    }
  },
  computed: {
    ...mapState("clients/details", ["saleOrders", "client", "page"]),
    sales() {
      return this.saleOrders || [];
    },        
    exportURL() {
      let clientFilter = "client.id:" + this.client.id;
      let searchFilter = this.search ? this.filter.replace(/{}/g, this.search) : "";
      return `${this.$axios.defaults.baseURL}/api/saleOrders/reports?filter=` + searchFilter + clientFilter;
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
