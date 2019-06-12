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
          <v-btn dark icon @click="saveReceptionStatus">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="receptionStatusForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del estado</h3>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field
                v-model="receptionStatusModel.nativeId"
                counter="2"
                hint="Por ejemplo, R"
                label="Id Local"
                :rules="nativeIdRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field
                v-model="receptionStatusModel.color"
                counter="20"
                hint="Por ejemplo, primary"
                label="Color"
                :rules="colorRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-text-field
                v-model="receptionStatusModel.icon"
                counter="20"
                hint="Por ejemplo, fa-save"
                label="Ícono"
                :rules="iconRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="receptionStatusModel.description"
                label="Descripción"
                counter="100"
                hint="Por ejemplo, Recibido"
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
    receptionStatus: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      receptionStatusModel: {},
      valid: true
    };
  },
  watch: {
    receptionStatus: {
      handler() {
        this.receptionStatusModel = JSON.parse(
          JSON.stringify(this.receptionStatus)
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
    receptionStatusToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.receptionStatusModel
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
    ...mapActions("receptionStatuses", [
      "createReceptionStatus",
      "updateReceptionStatus"
    ]),
    async saveReceptionStatus() {
      if (this.$refs.receptionStatusForm.validate()) {
        const receptionStatus = this.receptionStatusToSave;
        try {
          const { description } = receptionStatus;
          const res = await this.$confirm(
            `¿Está seguro de guardar el estado '${description}'?`,
            {
              title: "Advertencia"
            }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createReceptionStatus({ receptionStatus });
            } else if (this.mode === "editar") {
              await this.updateReceptionStatus({ receptionStatus });
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
    this.receptionStatusModel = { ...this.receptionStatus };
  }
};
</script>
