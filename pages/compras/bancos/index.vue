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
    <template #filters>      
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        clearable
        clear-icon="fa-times"
        hide-details
      ></v-text-field>
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
            <td class="text-xs-left">{{ props.item.name || "Sin nombre"}}</td>
            <td class="text-xs-left">{{ props.item.accountNumberMask || "Sin máscara de cuenta"}}</td>
            <td class="text-xs-left">
              <span class="mr-2">{{ $_.get(props.item.country, "iso", "Sin país") }}</span>
              <flag
                :iso='$_.get(props.item.country, "iso", "Sin país")'
                :title='$_.get(props.item.country, "name", "Sin país")'
                :squared="false"
              ></flag>
            </td>
            <td class="text-xs-center" @click.stop="() => {}">
              <v-speed-dial direction="left" open-on-hover>
                <template v-slot:activator>
                  <v-btn class="mx-1" color="secondary" dark icon flat small>
                    <v-icon small>fa-wrench</v-icon>
                  </v-btn>
                </template>
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
              </v-speed-dial> 
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
        { text: "Acciones", align: "center", value: "id", width: "10%",sortable: false }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20, // -1 for All",
        sortBy: "id"
      },
      search: "",
      filter: "name:{}*,country.name:{}*",
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
      },    
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
        await this.$store.dispatch("banks/fetchBanks", params);
      },
    }
  },
  computed: {
    ...mapState("banks", ["banks", "page", "countries"])
  },
  methods: {
    ...mapActions("banks", {
      deleteBankAction: "deleteBank"
    }),
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

