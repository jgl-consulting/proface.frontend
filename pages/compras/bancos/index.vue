<template>
  <simple-table-layout>
    <template #title>
      <h1>Bancos</h1>
    </template>
    <template #actions>
      <v-btn color="accent" @click="openAddBankDialog">
        <v-icon small>fa-plus</v-icon>
        <span class="mx-1">Nuevo Banco</span>
      </v-btn>
    </template>
    <template #table>
      <v-data-table
        :headers="headers"
        :items="banks"
        :expand="expand"
        item-key="id"
        class="elevation-1"
        :total-items="page.totalElements"
        :pagination.sync="pagination"
        :rows-per-page-items="pageSizes"
        rows-per-page-text="Tamaño de página"
      >
        <template v-slot:items="props">
          <tr @click.stop="props.expanded = !props.expanded">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.accountNumberMask }}</td>
            <td class="text-xs-left">
              <span class="mr-2">{{ getCountryIso(props.item.country) }}</span>
              <flag
                :iso="getCountryIso(props.item.country)"
                :title="getCountryName(props.item.country)"
                :squared="false"
              ></flag>
            </td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-btn
                class="mx-1"
                color="accent"
                dark
                icon
                flat
                small
                @click.stop="openEditBankDialog(props.item)"
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
                @click.stop="deleteBank(props.item)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template #dialog>
      <save-bank-dialog v-model="openSaveDialog" :bank="bankToSave" :mode="dialogMode"></save-bank-dialog>
    </template>
  </simple-table-layout>
</template>

<script>
import EmptyListTile from "@/components/common/EmptyListTile";
import SaveBankDialog from "@/components/banks/SaveBankDialog";
import { mapState, mapActions } from "vuex";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Bancos", link: "/compras/bancos" }
    ]
  },
  components: {
    EmptyListTile,
    SaveBankDialog
  },
  async fetch({ store }) {
    //const params = { requestPage: 0, size: 20, sortBy: undefined };
    //await store.dispatch("banks/fetchBanks", params);
    await store.dispatch("banks/fetchCountries");
  },
  data() {
    return {
      title: "Bancos",
      headers: [
        { text: "Nombre", align: "left", value: "name" },
        { text: "Máscara", align: "left", value: "accountNumberMask" },
        { text: "País", align: "left", value: "country" },
        { text: "Acciones", align: "center", value: "id", sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      expand: false,
      pageSizes: [20, 30, 50, 100],
      bankToSave: {
        country: { id: 0 }
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
        await this.$store.dispatch("banks/fetchBanks", params);
      }
    }
  },
  computed: {
    ...mapState("banks", ["banks", "page", "countries"])
  },
  methods: {
    ...mapActions("banks", {
      deleteBankAction: "deleteBank"
    }),
    getCountryIso(country) {
      return country ? country.iso : "Sin país";
    },
    getCountryName(country) {
      return country ? country.name : "Sin país";
    },
    openAddBankDialog() {
      this.openSaveDialog = true;
      this.bankToSave = {
        country: { id: 0 }
      };
      this.dialogMode = "nuevo";
    },
    openEditBankDialog(bank) {
      this.openSaveDialog = true;
      this.bankToSave = bank;
      this.dialogMode = "editar";
    },
    async deleteBank(bank) {
      try {
        const { name } = bank;
        const res = await this.$confirm(
          `¿Está seguro de borrar el banco '${name}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          await this.deleteBankAction({ bank });
          await this.$confirm("Borrado correcto!", {
            title: "Éxito",
            color: "success"
          });
        }
      } catch (error) {
        this.showError(error);
      }
    },
    optional(object) {
      return object || {};
    },
    showError(error) {
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    }
  }
};
</script>

