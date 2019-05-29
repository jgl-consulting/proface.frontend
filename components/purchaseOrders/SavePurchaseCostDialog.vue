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
          <v-btn dark icon @click="savePurchaseCost">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="purchaseCostForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del costo</h3>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="purchaseCostModel.description"
                label="Descripción"
                :rules="descriptionRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-select
                v-model="purchaseCostModel.currency"
                :items="currencies"
                item-value="id"
                item-text="name"
                label="Moneda"
                return-object
              ></v-select>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field v-model="purchaseCostModel.totalCost" label="Monto"></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required } from "@/util/validators";

export default {
  props: {
    purchaseCost: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      purchaseCostModel: {},
      valid: true
    };
  },
  watch: {
    purchaseCost: {
      handler() {
        this.purchaseCostModel = JSON.parse(JSON.stringify(this.purchaseCost));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo costo";
      } else if (this.mode == "editar") {
        return "Editar costo";
      }
    },
    ...mapState("purchaseOrders/details", ["currencies"]),
    purchaseCostToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.purchaseCostModel
        })
      );
    },
    descriptionRules() {
      return [value => required(value, "La descripción es requerida")];
    }
  },
  methods: {
    ...mapActions("purchaseOrders/details", [
      "createPurchaseCost",
      "updatePurchaseCost"
    ]),
    async savePurchaseCost() {
      if (this.$refs.purchaseCostForm.validate()) {
        const purchaseCost = this.purchaseCostToSave;
        try {
          const res = await this.$confirm(
            `¿Está seguro de guardar el costo?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createPurchaseCost({ purchaseCost });
            } else if (this.mode === "editar") {
              await this.updatePurchaseCost({ purchaseCost });
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
    this.purchaseCostModel = { ...this.purchaseCost };
  }
};
</script>
