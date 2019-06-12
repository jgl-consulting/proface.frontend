<template>
  <v-dialog v-model="value" persistent width="900">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="savePurchaseDetail">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="purchaseDetailForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del detalle</h3>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-select
                v-model="purchaseDetailModel.product"
                return-object
                itemid="id"
                item-text="name"
                :items="products"
                :rules="productRules"
                label="Producto"
              ></v-select>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="purchaseDetailModel.quantity"
                label="Cantidad"
                hint="Por ejemplo, 1"
                :rules="quantityRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="purchaseDetailModel.nativeId"
                counter="20"
                :rules="nativeIdRules"
                hint="Por ejemplo, DP001"
                label="Id Local"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-select
                v-model="purchaseDetailModel.status"
                return-object
                itemid="id"
                item-text="description"
                :items="filteredStatuses"
                :rules="statusRules"
                label="Estado"
              ></v-select>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="purchaseDetailModel.unitPrice"
                hint="Por ejemplo, 2.50"
                label="Precio Unitario"
              ></v-text-field>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="purchaseDetailModel.disscount"
                hint="Por ejemplo, 1.50"
                label="Descuento"
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
import { required, maxLength, referenced } from "@/util/validators";

export default {
  props: {
    purchaseDetail: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      purchaseDetailModel: {},
      valid: true
    };
  },
  watch: {
    purchaseDetail: {
      handler() {
        this.purchaseDetailModel = JSON.parse(
          JSON.stringify(this.purchaseDetail)
        );
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo detalle";
      } else if (this.mode == "editar") {
        return "Editar detalle";
      }
    },
    ...mapState("purchaseOrders/details", ["receptionStatuses", "products"]),
    purchaseDetailToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.purchaseDetailModel
        })
      );
    },
    filteredStatuses() {
      return this.receptionStatuses.filter(s => {
        return s.order >= this.purchaseDetailModel.status.order;
      });
    },
    productRules() {
      return [value => referenced(value, "El producto es requerido")];
    },
    statusRules() {
      return [value => referenced(value, "El estado es requerido")];
    },
    quantityRules() {
      return [value => required(value, "La cantidad es requerida")];
    },
    nativeIdRules() {
      return [
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    }
  },
  methods: {
    ...mapActions("purchaseOrders/details", [
      "createPurchaseDetail",
      "updatePurchaseDetail"
    ]),
    async savePurchaseDetail() {
      if (this.$refs.purchaseDetailForm.validate()) {
        const purchaseDetail = this.purchaseDetailToSave;
        try {
          const { product } = purchaseDetail;
          const res = await this.$confirm(
            `¿Está seguro de guardar el detalle del producto '${
              product.name
            }'?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createPurchaseDetail({ purchaseDetail });
            } else if (this.mode === "editar") {
              await this.updatePurchaseDetail({ purchaseDetail });
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
    this.purchaseDetailModel = { ...this.purchaseDetail };
  }
};
</script>
