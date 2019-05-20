<template>
    <simple-table-layout>
      <template #title>
        <v-subheader>
          Listado de productos solicitados
        </v-subheader>
      </template>
      <template #actions>
        <v-btn color="accent"  @click="openAddPurchaseDetailDialog">
          <v-icon small>fa-plus</v-icon>
          <span class="mx-1"></span>
          <span>Solicitar nuevo producto</span>
        </v-btn>
      </template>
      <template #table>
        <v-data-table
          :headers="purchaseDetailHeaders"
          :items="purchaseDetails"
          class="elevation-1"
        >
          <template #items="{ item }">
            <td class="text-xs-right">{{ item.product.name }}</td>
            <td class="text-xs-right">{{ item.quantity }}</td>
            <td class="text-xs-right">{{ item.unitPrice }}</td>
            <td class="text-xs-right">{{ item.disscount }}</td>
            <td class="text-xs-right">{{ item.finalPrice }}</td>
            <td class="text-xs-right">{{ item.status.description }}</td>
            <td class="text-xs-right">
              <v-btn class="mx-1" color="accent" dark icon flat small
                @click.stop="openEditPurchaseDetailDialog(item)">
                <v-icon small>fa-pen</v-icon>
              </v-btn>
              <v-btn class="mx-1" color="deep-purple darken-2" dark icon flat small
                @click.stop="deletePurchaseDetail(item)">
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </template>
      <template #dialog>
        <save-purchase-detail-dialog
          v-model="openSaveDetailDialog"
          :purchase-detail="purchaseDetailToSave"
          :mode="dialogMode"
        ></save-purchase-detail-dialog>
      </template>
    </simple-table-layout>
</template>

<script>
import EmptyListTile from '@/components/common/EmptyListTile';
import SavePurchaseDetailDialog from '@/components/purchaseOrders/SavePurchaseDetailDialog';
import { mapState, mapActions } from 'vuex';

export default {
  async fetch({ params: { purchaseOrderId }, route, store }) {
    await store.dispatch('purchaseOrders/details/fetchSupplier', { purchaseOrderId });
    await store.dispatch('purchaseOrders/details/fetchReceptionStatuses');
  },
  components: {
    EmptyListTile,
    SavePurchaseDetailDialog
  },
  data: () => ({
    purchaseDetailHeaders: [
      { text: 'Producto', value: 'product' },
      { text: 'Cantidad', value: 'quantity' },
      { text: 'Precio Unitario', value: 'unitPrice' },
      { text: 'Descuento', value: 'disscount' },
      { text: 'Precio Final', value: 'finalPrice' },
      { text: 'Estado', value: 'status' },
      { text: 'Acciones', value: 'id' }
    ],
    purchaseDetailToSave: {
      status: { id: 0 }
    },
    openSaveDetailDialog: false,
    dialogMode: 'nuevo'
  }),
  computed: {
    ...mapState('purchaseOrders/details',[
      'purchaseOrder'
    ])
  },
  methods: {
    ...mapActions('purchaseOrders/details', {
      deletePurchaseDetailAction: 'deletePurchaseDetail'
    }),
    openAddPurchaseDetailDialog() {
      this.openSaveDetailDialog = true;
      this.purchaseDetailToSave = {
        status: { id: 0 },
      };
      this.dialogMode = 'nuevo';
    },
    openEditPurchaseDetailDialog(purchaseDetail) {
      this.openSaveDetailDialog = true;
      this.purchaseDetailToSave = purchaseDetail;
      this.dialogMode = 'editar';
    },
    async deletePurchaseDetail(purchaseDetail){
      try {
        const { product } = purchaseDetail;
        const res = await this.$confirm(`¿Está seguro de borrar la cuenta '${product.name}'?`, { title: 'Advertencia' })
        if(res) {
          
          await this.deletePurchaseDetailAction({ purchaseDetail })
          
          await this.$confirm('Borrado correcto!', {
            title: 'Éxito',
            color: 'success'
          });
        }
      } catch(error) {
        this.showError(error);
      }
    },
    showError(error){
      const { message, errors } = this.$_.get(error, 'response.data', {
        message: 'Error inesperado',
        errors: [ error.message ]
      });

      this.$confirm(errors.map(e => e.errorMessage).join('\n'), { 
        title: message, 
        color: 'error',
        width: 500
      });
    },
  }
}
</script>

<style>

</style>
