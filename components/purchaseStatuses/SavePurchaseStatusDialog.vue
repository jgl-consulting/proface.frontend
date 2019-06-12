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
          <v-btn dark icon @click="savePurchaseStatus">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="purchaseStatusForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del estado</h3>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field
                v-model="purchaseStatusModel.nativeId"
                counter="2"
                hint="Por ejemplo: CR"
                label="Id Local"
                :rules="nativeIdRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field
                v-model="purchaseStatusModel.color"
                counter="20"
                label="Color"
                hint="Por ejemplo, primary"
                :rules="colorRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field
                v-model="purchaseStatusModel.icon"
                counter="20"
                label="Ícono"
                hint="Por ejemplo, fa fa-save"
                :rules="iconRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="purchaseStatusModel.description"
                label="Descripción"
                counter="100"
                hint="Por ejemplo, creado"
                :rules="descriptionRules"
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

export default {
  props: {
    purchaseStatus: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      purchaseStatusModel: {},
      valid: true
    };
  },
  watch: {
    purchaseStatus: {
      handler() {
        this.purchaseStatusModel = JSON.parse(
          JSON.stringify(this.purchaseStatus)
        );
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo estado";
      } else if (this.mode == "editar") {
        return "Editar estado";
      }
    },
    purchaseStatusToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.purchaseStatusModel
        })
      );
    },
    nativeIdRules() {
      return [
        value => required(value, "El identificador es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 2)
      ];
    },
    colorRules() {
      return [value => maxLength(value, "El ícono es demasiado grande", 20)];
    },
    iconRules() {
      return [value => maxLength(value, "El color es demasiado grande", 20)];
    },
    descriptionRules() {
      return [
        value => required(value, "La descripción es requerido"),
        value => maxLength(value, "La descripción es demasiado grande", 100)
      ];
    }
  },
  methods: {
    ...mapActions("purchaseStatuses", [
      "createPurchaseStatus",
      "updatePurchaseStatus"
    ]),
    async savePurchaseStatus() {
      if (this.$refs.purchaseStatusForm.validate()) {
        const purchaseStatus = this.purchaseStatusToSave;
        try {
          const { description } = purchaseStatus;
          const res = await this.$confirm(
            `¿Está seguro de guardar el estado '${description}'?`,
            {
              title: "Advertencia"
            }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createPurchaseStatus({ purchaseStatus });
            } else if (this.mode === "editar") {
              await this.updatePurchaseStatus({ purchaseStatus });
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
    this.purchaseStatusModel = { ...this.purchaseStatus };
  }
};
</script>
