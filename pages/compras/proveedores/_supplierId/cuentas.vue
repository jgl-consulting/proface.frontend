<template>
  <simple-table-layout>
    <template #title>
      <v-subheader>Listado de cuentas</v-subheader>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddSupplierAccountDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1"></span>
        <span>Nueva cuenta</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table :headers="accountHeaders" :items="supplierAccounts" class="elevation-1">
        <template #items="{ item }">
          <td class="text-xs-left">{{ item.number || "Sin número de cuenta" }}</td>
          <td class="text-xs-left">{{ item.cci || "Sin número internacional" }}</td>
          <td class="text-xs-left">{{ item.description || "Sin descripción" }}</td>
          <td class="text-xs-left">{{ $_.get(item.currency, "name", "Sin moneda") }}</td>
          <td class="text-xs-left">{{ $_.get(item.bank, "name", "Sin banco") }}</td>
          <td class="text-xs-left">
            <span class="mr-2">{{ $_.get(item.bank, "country.iso", "Sin país") }}</span>
            <flag
              :iso='$_.get(item.bank, "country.iso", "Sin país")'
              :title='$_.get(item.bank, "country.name", "Sin país")'
              :squared="false"
            ></flag>
          </td>
          <td class="text-xs-left">
            <v-btn
              class="mx-1"
              color="accent"
              dark
              icon
              flat
              small
              @click.stop="openEditSupplierAccountDialog(item)"
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
              @click.stop="deleteSupplierAccount(item)"
            >
              <v-icon small>fa-trash</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-supplier-account-dialog
        v-model="openSaveAccountDialog"
        :supplier-account="supplierAccountToSave"
        :mode="dialogMode"
      ></save-supplier-account-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveSupplierAccountDialog from "@/components/suppliers/SaveSupplierAccountDialog";
import { mapState, mapActions } from "vuex";
export default {
  async fetch({ params: { supplierId }, route, store }) {
    await store.dispatch("suppliers/details/fetchSupplier", { supplierId });
    await store.dispatch("suppliers/details/fetchBanks");
    await store.dispatch("suppliers/details/fetchCurrencies");
  },
  components: {
    EmptyListTile,
    SaveSupplierAccountDialog
  },
  data: () => ({
    accountHeaders: [
      {
        text: "Número de cuenta",
        align: "left",
        value: "number"
      },
      { text: "CCI", value: "cci" },
      { text: "Descripción", value: "description" },
      { text: "Moneda", value: "currency" },
      { text: "Banco", value: "bank" },
      { text: "País", value: "bank" },
      { text: "Acciones", value: "id", sortable: false }
    ],
    supplierAccountToSave: {
      bank: { id: 0 },
      currency: { id: 0 }
    },
    openSaveAccountDialog: false,
    dialogMode: "nuevo"
  }),
  computed: {
    ...mapState("suppliers/details", ["supplier"]),
    supplierAccounts() {
      return this.supplier.accounts || [];
    }
  },
  methods: {
    ...mapActions("suppliers/details", {
      deleteSupplierAccountAction: "deleteSupplierAccount"
    }),
    openAddSupplierAccountDialog() {
      this.openSaveAccountDialog = true;
      this.supplierAccountToSave = {
        bank: { id: 0 },
        currency: { id: 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditSupplierAccountDialog(supplierAccount) {
      this.openSaveAccountDialog = true;
      this.supplierAccountToSave = supplierAccount;
      this.dialogMode = "editar";
    },
    async deleteSupplierAccount(supplierAccount) {
      try {
        const { number } = supplierAccount;
        const res = await this.$confirm(
          `¿Está seguro de borrar la cuenta '${number}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteSupplierAccountAction({ supplierAccount });
          await this.$confirm("Borrado correcto!", {
            title: "Éxito",
            color: "success"
          });
        }
      } catch (error) {
        this.showError(error);
      }
    },
    showError(error) {
      const { message, errors } = this.$_.get(error, "response.data", {
        message: "Error inesperado",
        errors: [error.message]
      });
      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    }
  }
};
</script>

<style>
</style>
