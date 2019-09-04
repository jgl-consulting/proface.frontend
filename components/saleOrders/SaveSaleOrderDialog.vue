<template>
  <v-dialog v-model="value" persistent width="850">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="saveSaleOrder">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form>
          <form-group>
            <template #title>Datos de la Orden de Venta</template>
            <template #controls>
              <v-flex md4 pa-2>
                <v-text-field
                  v-model="saleOrderModel.nativeId"
                  counter="20"
                  hint="Por ejemplo, OV0001"
                  label="Identificador"
                  :rules="nativeIdRules"
                ></v-text-field>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker v-model="saleOrderModel.creationDate" label="Fecha de Creación"></datepicker>
              </v-flex>
              <v-flex md4 pa-2>
                <v-select
                  v-model="saleOrderModel.user"
                  :items="users"
                  item-value="id"
                  item-text="firstName"
                  label="Vendedor"
                  return-object
                ></v-select>
              </v-flex>
              <v-flex md6 pa-2>
                <v-autocomplete
                  v-model="saleOrderModel.client"
                  :items="clients"
                  item-value="id"
                  item-text="name"
                  :hint="clientAutocompleteHint"
                  return-object
                  :rules="clientRules"
                  label="Cliente"
                ></v-autocomplete>
              </v-flex>
              <v-flex md6 pa-2>
                <v-select
                  v-model="saleOrderModel.status"
                  :items="filteredStatuses"
                  item-value="id"
                  item-text="description"
                  return-object
                  label="Estado"
                ></v-select>
              </v-flex>
            </template>
          </form-group>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required, maxLength, referenced } from "@/util/validators";
import FormGroup from "@/components/common/FormGroup";
import Datepicker from "@/components/common/Datepicker";
export default {
  components: {
    FormGroup,
    Datepicker
  },
  props: {
    saleOrder: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      saleOrderModel: {}
    };
  },
  watch: {
    saleOrder: {
      handler() {
        this.saleOrderModel = JSON.parse(
          JSON.stringify(this.saleOrder)
        );
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nueva orden de venta";
      } else if (this.mode == "editar") {
        return "Editar orden de venta";
      }
    },
    filteredStatuses() {
      return this.saleStatuses.filter(s => {
        return s.order >= this.saleOrderModel.status.order;
      });
    },
    clientAutocompleteHint() {
      const { name } = this.saleOrderModel.client || {};
      return name ? name : "";
    },
    ...mapState("saleOrders", [
      "saleStatuses",
      "clients",
      "users"
    ]),
    saleOrderToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.saleOrderModel
        })
      );
    },
    nativeIdRules() {
      return [
        value => required(value, "El identificador es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    },
    clientRules() {
      return [ value => referenced(value, "El cliente es requerido")];
    },
  },
  methods: {
    ...mapActions("saleOrders", [
      "createSaleOrder",
      "updateSaleOrder"
    ]),
    async saveSaleOrder() {
      const saleOrder = this.saleOrderToSave;
      try {
        const { nativeId } = saleOrder;
        const res = await this.$confirm(
          `¿Está seguro de guardar la orden de venta '${nativeId}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          if (this.mode === "nuevo") {
            await this.createSaleOrder({ saleOrder });
          } else if (this.mode === "editar") {
            await this.updateSaleOrder({ saleOrder });
          }

          await this.$confirm("Guardado correcto!", {
            title: "Éxito",
            color: "success"
          });

          this.closeDialog();
        }
      } catch (error) {
        this.showError(error);
      }
    },
    closeDialog() {
      this.isOpen = false;
      this.$emit("input", this.isOpen);
    },
    showError(error) {
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    }
  },
  created() {
    this.isOpen = this.value;
    this.saleOrderModel = { ...this.saleOrder };
  }
};
</script>
