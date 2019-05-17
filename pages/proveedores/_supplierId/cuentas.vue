<template>
    <simple-table-layout>
      <template #title>
        <v-subheader>
          Listado de cuentas
        </v-subheader>
      </template>
      <template #actions>
        <v-btn color="accent" >
          <v-icon small>fa-plus</v-icon>
          <span class="mx-1"></span>
          <span>Nueva cuenta</span>
        </v-btn>
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
      <template #dialog>
        <save-supplier-account-dialog
          v-model="openSaveDialog"
          :supplier="supplierAccountToSave"
          :mode="dialogMode"
        ></save-supplier-account-dialog>
      </template>
    </simple-table-layout>
</template>

<script>
import SaveSupplierAccountDialog from '@/components/suppliers/SaveSupplierAccountDialog';
import { mapState } from 'vuex';

export default {
  async fetch({ params: { supplierId }, route, store }) {
    const fetchSupplierAction ='suppliers/details/fetchSupplier';
    await store.dispatch(fetchSupplierAction, { supplierId });
  },
  components: {
    SaveSupplierAccountDialog
  },
  data: () => ({
    accountHeaders: [
      {
        text: 'Número de cuenta',
        align: 'left',
        sortable: false,
        value: 'number'
      },
      { text: 'CCI', value: 'cci' },
      { text: 'Descripción', value: 'description' },
      { text: 'Moneda', value: 'currency' },
      { text: 'Banco', value: 'bank' },
      { text: 'País', value: 'bank' },
      { text: 'Acciones', value: 'id' }
    ],
    supplierAccountToSave: {
      bank: { id: 0 }
    },
    openSaveDialog: false,
    dialogMode: 'nuevo'
  }),
  computed: {
    ...mapState('suppliers/details',[
      'supplier'
    ]),
    supplierAccounts() {
      return this.supplier.accounts || [];
    }
  },
  methods: {
    openAddSupplierAccountDialog() {
      this.openSaveDialog = true;
      this.supplierAccountToSave = {
        bank: { id: 0 }
      };
      this.dialogMode = 'nuevo';
    },
    openEditSupplierAccountDialog(supplierAccount) {
      this.openSaveDialog = true;
      this.supplierAccountToSave = supplierAccount;
      this.dialogMode = 'editar';
    },
    async deleteSupplierAccount(supplier){
      try {
        const { number } = supplier;
        const res = await this.$confirm(`¿Está seguro de borrar la cuenta '${number}'?`, { title: 'Advertencia' })
        if(res) {
          
          await this.deleteSupplierAction({ supplier })
          
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
      const { message, errors } = error.response.data;
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
