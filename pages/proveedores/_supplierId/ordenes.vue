<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>
        Ordenes de compra
      </v-subheader>
    </template>
    <template #table>
      <v-data-table
        :headers="accountHeaders"
        :items="supplierAccounts"
        class="elevation-1"
      >
        <template #items="{ item }">
          <td>{{ item.number }}</td>
          <td class="text-xs-right">{{ item.cci }}</td>
          <td class="text-xs-right">{{ item.description || "No cuenta con descripción" }}</td>
          <td class="text-xs-right">{{ item.currency }}</td>
          <td class="text-xs-right">{{ item.bank.name }}</td>
          <td class="text-xs-right">{{ item.bank.country.name }}</td>
          <td class="text-xs-right">
            <v-btn class="mx-1" color="accent" dark icon flat small
              @click.stop="openEditSupplierAccountDialog(item)">
              <v-icon small>fa-pen</v-icon>
            </v-btn>
            <v-btn class="mx-1" color="deep-purple darken-2" dark icon flat small
              @click.stop="deleteSupplierAccount(item)">
              <v-icon small>fa-trash</v-icon>
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
    const fetchSupplierAction ='suppliers/details/fetchSupplier';
    await store.dispatch(fetchSupplierAction, { supplierId });
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
    ]
  })
}
</script>

<style>

</style>
