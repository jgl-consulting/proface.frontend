<template>
    <simple-table-layout>
      <template #title>
        <v-subheader>
          Órdenes de Compra
        </v-subheader>
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
          rows-per-page-text="Tamaño de página">
        >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">
              {{ props.item.nativeId }}
            </td>
            <td class="text-xs-right">
              {{ props.item.creationDate }} 
            </td>
            <td class="text-xs-right">
              {{ props.item.receptionDate }} 
            </td>
            <td class="text-xs-right">
              {{ props.item.status.description }}
            </td>
          </tr>
        </template>
      </v-data-table>
      </template>
    </simple-table-layout>
</template>

<script>
import EmptyListTile from '@/components/common/EmptyListTile';
import { mapState, mapActions } from 'vuex';

export default {
  async fetch({ params: { supplierId }, route, store }) {
    const params = { requestPage: 0, size: 20, sortBy: undefined };
    await store.dispatch("suppliers/details/fetchSupplier", { supplierId });
    await store.dispatch('suppliers/details/fetchPurchaseOrders', params);
  },
  components: {
    EmptyListTile
  },
  data() {
    return {
      title: 'Órdenes de Compra',
      purchaseHeaders: [
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Id Local', value: 'nativeId' },
        { text: 'Fecha de Emisión', value: 'creationDate'},
        { text: 'Fecha de Recepción', value: 'receptionDate'},
        { text: 'Estado', value: 'status' },
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20,// -1 for All",
        sortBy: 'id'
      },
      expand: false,
      pageSizes: [20, 30, 50, 100]
    }
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
        await this.$store.dispatch('suppliers/details/fetchPurchaseOrders', params);
      }
    }
  },
  computed: {
    ...mapState('suppliers/details',[
      'purchaseOrders',
      'page'
    ]),
    purchases() {
      return this.purchaseOrders || [];
    }
  },
  optional(object) {
    return object || {};
  }
}
</script>
