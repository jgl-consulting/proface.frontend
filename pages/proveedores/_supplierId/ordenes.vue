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
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-right">
            {{ props.item.nativeId }}
          </td>
          <td class="text-xs-right">
            {{ props.item.creationDate }} 
          </td>
          <td class="text-xs-right">
            {{ props.item.quotationDate }} 
          </td>
          <td class="text-xs-right">
            {{ props.item.billingDate }} 
          </td>
          <td class="text-xs-right">
            {{ props.item.receptionDate }} 
          </td>
          <td class="text-xs-right">
            {{ props.item.supplier.name }}
          </td>
          <td class="text-xs-right">
            {{ props.item.status.description }}
          </td>
          <td class="text-xs-center" @click.stop="() => {}">
            <v-btn class="mx-1" color="primary" dark icon flat small
              nuxt :to="props.item.id | path($route.fullPath)">
              <v-icon small>fa-ellipsis-v</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </template>
  </simple-table-layout>
</template>

<script>
export default {
  async fetch({ params: { supplierId }, route, store }) {
    const params = { requestPage: 0, size: 20, sortBy: undefined };
    await store.dispatch('suppliers/details/fetchSupplier', { supplierId });
    await store.dispatch('suppliers/details/fetchPurchaseOrderBySupplier', { 
      supplierId, 
      params
    });
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
    purchaseOrderToSave: {
      status: { id: 0 },
      supplier: { id: 0 }
    },
  }),
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
        await this.$store.dispatch('purchaseOrders/fetchPurchaseOrders', params);
      }
    }
  },
}
</script>

<style>

</style>
