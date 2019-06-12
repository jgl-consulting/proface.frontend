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
          <v-btn dark icon @click="saveProductLine">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="productLineForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos de la línea</h3>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="productLineModel.name"
                label="Nombre"
                counter="100"
                hint="Por ejemplo, Instrumento"
                :rules="nameRules"
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
    productLine: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      productLineModel: {},
      valid: true
    };
  },
  watch: {
    productLine: {
      handler() {
        this.productLineModel = JSON.parse(JSON.stringify(this.productLine));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nueva línea";
      } else if (this.mode == "editar") {
        return "Editar línea";
      }
    },
    productLineToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.productLineModel
        })
      );
    },
    nameRules() {
      return [
        value => required(value, "El nombre es requerido"),
        value => maxLength(value, "El nombre es demasiado grande", 100)
      ];
    }
  },
  methods: {
    ...mapActions("productLines", ["createProductLine", "updateProductLine"]),
    async saveProductLine() {
      if (this.$refs.productLineForm.validate()) {
        const productLine = this.productLineToSave;
        try {
          const { name } = productLine;
          const res = await this.$confirm(
            `¿Está seguro de guardar la línea '${name}'?`,
            {
              title: "Advertencia"
            }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createProductLine({ productLine });
            } else if (this.mode === "editar") {
              await this.updateProductLine({ productLine });
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
    this.productLineModel = { ...this.productLine };
  }
};
</script>
