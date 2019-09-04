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
          <v-btn dark icon @click="saveUnit">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="unitForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos de la Unidad</h3>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-select
                v-model="unitModel.product"
                return-object
                itemid="id"
                item-text="name"
                :items="products"
                :rules="productRules"
                label="Producto"
              ></v-select>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field
                v-model="unitModel.nativeId"
                counter="20"
                :rules="nativeIdRules"
                hint="Por ejemplo, U0001"
                label="Id Local"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-select
                v-model="unitModel.location"
                return-object
                itemid="id"
                item-text="description"
                :items="locations"
                :rules="locationRules"
                label="Ubicación"
              ></v-select>
            </v-flex>
            <v-flex sm6 pa-2>
              <div v-if="isNewUnit()">
                <v-select
                  v-model="unitModel.status"
                  return-object
                  itemid="id"
                  item-text="description"
                  :items="unitStatuses"
                  label="Estado"
                ></v-select>
              </div>
              <div v-else>
                <v-text-field
                  disabled
                  value="Disponible"
                  label="Estado"
                ></v-text-field>
              </div>
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
    unit: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      unitModel: {},
      valid: true
    };
  },
  watch: {
    unit: {
      handler() {
        this.unitModel = JSON.parse(
          JSON.stringify(this.unit)
        );
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nueva unidad";
      } else if (this.mode == "editar") {
        return "Editar unidad";
      }
    },
    ...mapState("units", ["unitStatuses", "products", "locations"]),
    unitToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.unitModel
        })
      );
    },
    productRules() {
      return [value => referenced(value, "El producto es requerido")];
    },
    locationRules() {
      return [value => referenced(value, "La ubicación es requerida")];
    },
    nativeIdRules() {
      return [
        value => maxLength(value, "El identificador es demasiado grande", 20),
        value => required(value, "El identificador es requerido")
      ];
    }
  },
  methods: {
    ...mapActions("units", [
      "createUnit",
      "updateUnit"
    ]),
    isNewUnit() {
      return this.mode != "nuevo";
    },
    async saveUnit() {
      if (this.$refs.unitForm.validate()) {
        const unit = this.unitToSave;
        try {
          const { nativeId } = unit;
          const res = await this.$confirm(
            `¿Está seguro de guardar la unidad '${
              nativeId
            }'?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createUnit({ unit });
            } else if (this.mode === "editar") {
              await this.updateUnit({ unit });
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
    this.unitModel = { ...this.unit };
  }
};
</script>
