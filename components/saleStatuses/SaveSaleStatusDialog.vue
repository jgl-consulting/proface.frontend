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
          <v-btn dark icon @click="saveSaleStatus">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="saleStatusForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del estado</h3>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="saleStatusModel.nativeId"
                counter="2"
                hint="Por ejemplo: CR"
                label="Id Local"
                :rules="nativeIdRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="saleStatusModel.color"
                counter="20"
                label="Color"
                hint="Por ejemplo, primary"
                :rules="colorRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="saleStatusModel.icon"
                counter="20"
                label="Ícono"
                hint="Por ejemplo, fa fa-save"
                :rules="iconRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm3 pa-2>
              <v-text-field
                v-model="saleStatusModel.order"
                counter="2"
                label="Orden"
                hint="Por ejemplo, 1"
                :rules="orderRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="saleStatusModel.description"
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
    saleStatus: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      saleStatusModel: {},
      valid: true
    };
  },
  watch: {
    saleStatus: {
      handler() {
        this.saleStatusModel = JSON.parse(
          JSON.stringify(this.saleStatus)
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
    saleStatusToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.saleStatusModel
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
    orderRules() {
      return [
        value => required(value, "El orden es requerido"),
      ];
    },
    descriptionRules() {
      return [
        value => required(value, "La descripción es requerido"),
        value => maxLength(value, "La descripción es demasiado grande", 100)
      ];
    }
  },
  methods: {
    ...mapActions("saleStatuses", [
      "createSaleStatus",
      "updateSaleStatus"
    ]),
    async saveSaleStatus() {
      if (this.$refs.saleStatusForm.validate()) {
        const saleStatus = this.saleStatusToSave;
        try {
          const { description } = saleStatus;
          const res = await this.$confirm(`¿Está seguro de guardar el estado '${description}'?`,{
            title: "Advertencia"
          });

          if (res) {
            if (this.mode === "nuevo") {
              await this.createSaleStatus({ saleStatus });
            } else if (this.mode === "editar") {
              await this.updateSaleStatus({ saleStatus });
            } else { 
              throw `No existe el modo ${this.mode}`
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
    this.saleStatusModel = { ...this.saleStatus };
  }
};
</script>
