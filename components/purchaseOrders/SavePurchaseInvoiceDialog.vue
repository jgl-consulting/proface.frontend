<template>
  <v-dialog v-model="value" persistent width="700">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="savePurchaseInvoice">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="purchaseInvoiceForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos de la factura</h3>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field
                v-model="purchaseInvoiceModel.nativeId"
                label="Id Local"
                counter="20"
                hint="Por ejemplo, F0001"
                :rules="nativeIdRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 pa-2>
              <datepicker
                v-model="purchaseInvoiceModel.emissionDate"
                label="Fecha de Emisión"
                :rules="emissionDateRules"
              ></datepicker>
            </v-flex>
            <v-flex sm9 pa-2>
              <v-text-field
                v-model="purchaseInvoiceModel.description"
                counter="300"
                hint="Por ejemplo, Factura de Proveedor - 10/01/2018"
                label="Descripción"
                :rules="descriptionRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="purchaseInvoiceModel.totalPrice"
                hint="Por ejemplo, 2000"
                label="Total"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required, maxLength } from "@/util/validators";
import Datepicker from "@/components/common/Datepicker";
export default {
  components: {
    Datepicker
  },
  props: {
    purchaseInvoice: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      purchaseInvoiceModel: {},
      valid: true
    };
  },
  watch: {
    purchaseInvoice: {
      handler() {
        this.purchaseInvoiceModel = JSON.parse(
          JSON.stringify(this.purchaseInvoice)
        );
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nueva factura";
      } else if (this.mode == "editar") {
        return "Editar factura";
      }
    },
    purchaseInvoiceToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.purchaseInvoiceModel
        })
      );
    },
    nativeIdRules() {
      return [
        value => required(value, "El identificador es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    },
    emissionDateRules() {
      return [value => required(value, "La fecha de emisión es requerida")];
    },
    descriptionRules() {
      return [
        value => required(value, "La descripción es requerido"),
        value => maxLength(value, "La descripción es demasiado grande", 300)
      ];
    },
  },
  methods: {
    ...mapActions("purchaseOrders/details", [
      "createPurchaseInvoice",
      "updatePurchaseInvoice"
    ]),
    async savePurchaseInvoice() {
      if (this.$refs.purchaseInvoiceForm.validate()) {
        const purchaseInvoice = this.purchaseInvoiceToSave;
        try {
          const res = await this.$confirm(
            `¿Está seguro de guardar la factura?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createPurchaseInvoice({ purchaseInvoice });
            } else if (this.mode === "editar") {
              await this.updatePurchaseInvoice({ purchaseInvoice });
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
      } else {
        this.showError({
          response: {
            data: {
              message: "Error de Validación",
              errors: [{ errorMessage: "Existen campos que no son válidos." }]
            }
          }
        });
      }
    },
    closeDialog() {
      this.isOpen = false;
      this.$emit("input", this.isOpen);
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
  },
  created() {
    this.isOpen = this.value;
    this.purchaseInvoiceModel = { ...this.purchaseInvoice };
  }
};
</script>
