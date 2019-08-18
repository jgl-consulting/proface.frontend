<template>
  <SimpleTableLayout>
    <template #title>
      <h1>{{ title }}</h1>
    </template>
    <template #actions>
      <v-btn 
        v-if="$isAllowed('registerSale')"
        color="accent" 
        to="/compras/ordenesVenta/nuevaVenta" 
        nuxt>
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nueva Orden de Venta</span>
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
        :headers="headers"
        :items="saleOrders"
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
            <td class="text-xs-left">{{ formatDate(props.item.creationDate) }}</td>
            <td class="text-xs-left">{{ $_.get(props.item.client, "name", "Sin cliente") }}</td>
            <td
              class="text-xs-left"
            >{{ $_.get(props.item.currency, "symbol", "S/.") + ' ' + props.item.localTotal }}</td>
            <td class="text-xs-left">{{ 'S/. ' + props.item.localTotal }}</td>
            <td class="text-xs-left">
              <v-icon
                :color='$_.get(props.item.status, "color", "primary")'
                small
              >
              {{$_.get(props.item.status, "icon", "fa fa-calendar")}}</v-icon> - {{ $_.get(props.item.status, "description", "Sin estado")}}
            </td>
            <td class="text-xs-left" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover left>
                <template v-slot:activator>
                  <v-btn color="secondary" dark fab small>
                    <v-icon small>fa-wrench</v-icon>
                  </v-btn>
                </template>
                <v-btn
                  class="mx-1"
                  color="primary"
                  dark
                  fab
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
                  fab
                  small
                  v-if="$isAllowed('organizeSale')"
                  @click.stop="openEditSaleOrderDialog(props.item)"
                >
                  <v-icon small>fa-pen</v-icon>
                </v-btn>
                <v-btn
                  class="mx-1"
                  color="deep-purple darken-2"
                  dark
                  fab
                  small
                  v-if="$isAllowed('organizeSale')"
                  @click.stop="deleteSaleOrder(props.item)"
                >
                  <v-icon small>fa-trash</v-icon>
                </v-btn>
                <v-btn class="mx-1" color="red" dark fab small>
                  <v-icon small>fa-file-pdf</v-icon>
                </v-btn>
              </v-speed-dial>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
  </SimpleTableLayout>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import salePerimeter from '@/security/perimeters/sale-perimeter';

export default {
  routePerimeterAction: 'viewSale',
  perimeters: [
    salePerimeter
  ],
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Ordenes de Venta", link: "/ventas/ordenesVenta" }
    ]
  },
    data() {
    return {
      title: "Órdenes de Venta",
      headers: [
        { text: "Id Local", value: "nativeId" },
        { text: "Fecha de Emisión", value: "creationDate" },
        { text: "Cliente", value: "client" },
        { text: "Total", value: "total" },
        { text: "Total en Soles", value: "localTotal" },
        { text: "Estado", value: "status" },
        { text: "Acciones", value: "id", width: "10%", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      search: "",
      filter: "nativeId:{}*,client.name:{}*,status.description:{}*",
      pageSizes: [20, 30, 50, 100],
      saleOrderToSave: {
        status: { id: 0 },
        supplier: { id: 0 },
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
        await this.$store.dispatch(
          "saleOrders/fetchSaleOrders",
          params
        );
      }
    },
    search: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        let searchFilter = this.search
          ? this.filter.replace(/{}/g, this.search)
          : "";
        const params = {
          requestPage: page - 1,
          size: rowsPerPage,
          sortBy,
          descending,
          filter: searchFilter
        };
        await this.$store.dispatch(
          "saleOrders/fetchSaleOrders",
          params
        );
      }
    }
  },
  computed: {
    ...mapState("saleOrders", ["saleOrders", "page"]),    
    exportURL() {
      let searchFilter = this.search ? this.filter.replace(/{}/g, this.search) : "";
      return `${this.$axios.defaults.baseURL}/api/saleOrders/reports?filter=` + searchFilter;
    }
  },
  methods: {
    openEditSaleOrderDialog(saleOrder) {
      console.log({ saleOrder });
    },
    deleteSaleOrder(saleOrder) {
      console.log({ saleOrder });
    },
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
  }
}
</script>