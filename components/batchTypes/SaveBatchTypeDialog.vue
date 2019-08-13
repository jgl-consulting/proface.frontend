<template>
  <v-dialog v-model="value" persistent width="400">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="saveBatchType">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="batchTypeForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del tipo de empaque</h3>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="batchTypeModel.description"
                label="Descripción"
                counter="100"
                hint="Por ejemplo, Lote"
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
    batchType: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      batchTypeModel: {},
      valid: true
    };
  },
  watch: {
    batchType: {
      handler() {
        this.batchTypeModel = JSON.parse(JSON.stringify(this.batchType));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo tipo";
      } else if (this.mode == "editar") {
        return "Editar tipo";
      }
    },
    batchTypeToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.batchTypeModel
        })
      );
    },
    descriptionRules() {
      return [
        value => required(value, "La descripción es requerida"),
        value => maxLength(value, "La descripción es demasiado grande", 100)
      ];
    }
  },
  methods: {
    ...mapActions("batchTypes", ["createBatchType", "updateBatchType"]),
    async saveBatchType() {
      if (this.$refs.batchTypeForm.validate()) {
        const batchType = this.batchTypeToSave;
        try {
          const { description } = batchType;
          const res = await this.$confirm(
            `¿Está seguro de guardar el tipo '${description}'?`,
            {
              title: "Advertencia"
            }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createBatchType({ batchType });
            } else if (this.mode === "editar") {
              await this.updateBatchType({ batchType });
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
    this.batchTypeModel = { ...this.batchType };
  }
};
</script>
