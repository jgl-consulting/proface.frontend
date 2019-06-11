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
          <v-btn dark icon @click="saveUnitStatus">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="unitStatusForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del estado</h3>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field v-model="unitStatusModel.nativeId" label="Id Local" :rules="nativeIdRules"></v-text-field>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field v-model="unitStatusModel.color" label="Color"></v-text-field>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field v-model="unitStatusModel.icon" label="Ícono"></v-text-field>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field v-model="unitStatusModel.description" label="Descripción" :rules="descriptionRules"></v-text-field>
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
    unitStatus: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      unitStatusModel: {},
      valid: true
    };
  },
  watch: {
    unitStatus: {
      handler() {
        this.unitStatusModel = JSON.parse(JSON.stringify(this.unitStatus));
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
    unitStatusToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.unitStatusModel
        })
      );
    },
    nativeIdRules() {
      return [value => required(value, "El identificador es requerido")];
    },
    descriptionRules() {
      return [value => required(value, "La descripción es requerida")];
    }
  },
  methods: {
    ...mapActions("unitStatuses", ["createUnitStatus", "updateUnitStatus"]),
    async saveUnitStatus() {
      if (this.$refs.unitStatusForm.validate()) {
        const unitStatus = this.unitStatusToSave;
        try {
          const { nativeId } = unitStatus;
          const res = await this.$confirm(
            `¿Está seguro de guardar el estado '${nativeId}'?`,
            {
              title: "Advertencia"
            }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createUnitStatus({ unitStatus });
            } else if (this.mode === "editar") {
              await this.updateUnitStatus({ unitStatus });
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
    this.unitStatusModel = { ...this.unitStatus };
  }
};
</script>
