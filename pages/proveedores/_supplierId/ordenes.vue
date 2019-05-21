<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>
        Ordenes de compra
      </v-subheader>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="purchaseOrders"
        item-key="id"
        class="elevation-1"
        :total-items="page.totalElements"
        :pagination.sync="pagination"
        :rows-per-page-items="pageSizes"
        rows-per-page-text="Tamaño de página">
        <template v-slot:items="{ item }">
          <td>{{ item.id }}</td>
          <td class="text-xs-right">
            {{ item.nativeId }}
          </td>
          <td class="text-xs-right">
            {{ item.creationDate }} 
          </td>
          <td class="text-xs-right">
            {{ item.quotationDate }} 
          </td>
          <td class="text-xs-right">
            {{ item.billingDate }} 
          </td>
          <td class="text-xs-right">
            {{ item.receptionDate }} 
          </td>
          <td class="text-xs-right">
            {{ item.supplier.name }}
          </td>
          <td class="text-xs-right">
            {{ item.status.description }}
          </td>
          <td class="text-xs-center" @click.stop="() => {}">
            <v-btn class="mx-1" color="primary" dark icon flat small
              nuxt :to="item.id | orderDetailPath ">
              <v-icon small>fa-ellipsis-v</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </template>
  </simple-table-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async fetch({ params: { supplierId }, route, store }) {
    const pagination = { requestPage: 0, size: 20, sortBy: undefined };
    await store.dispatch('suppliers/details/fetchSupplier', { supplierId });
    await store.dispatch('suppliers/details/fetchPurchaseOrderBySupplier', { 
      supplierId, 
      pagination
    });
  },
  asyncData({params: { supplierId }}) {
    return {
      supplierId
    }
  },
  data: () => ({
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'id'
      },
      { text: 'Id Local', value: 'nativeId' },
      { text: 'Creación', value: 'creationDate' },
      { text: 'Presupuesto', value: 'quotationDate' },
      { text: 'Facturación', value: 'billingDate'},
      { text: 'Recepción', value: 'receptionDate'},
      { text: 'Proveedor', value: 'supplier'},
      { text: 'Estado', value: 'status' },
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
  }),
  watch: {
    pagination: {
      async handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        
        const pagination = { 
          requestPage: page - 1, 
          size: rowsPerPage, 
          sortBy,
          descending
        };
        await this.$store.dispatch('suppliers/details/fetchPurchaseOrderBySupplier', { 
          supplierId: this.supplierId,
          pagination 
        });
      }
    }
  },
  computed: {
    ...mapState('suppliers/details', [
      'purchaseOrders',
      'page'
    ])
  },
  filters: {
    orderDetailPath(orderPurchaseId) {
      return `/ordenesCompra/${orderPurchaseId}`;
    }
  }
}
</script>