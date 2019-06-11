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
          <v-btn dark icon @click="saveLocation">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="locationForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos de la ubicación</h3>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="locationModel.nativeId"
                label="Identificador"
                :rules="nativeIdRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="locationModel.description"
                label="Descripción"
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
import { required } from "@/util/validators";

export default {
  props: {
    location: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      locationModel: {},
      valid: true
    };
  },
  watch: {
    location: {
      handler() {
        this.locationModel = JSON.parse(JSON.stringify(this.location));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nueva ubicación";
      } else if (this.mode == "editar") {
        return "Editar ubicación";
      }
    },
    locationToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.locationModel
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
    ...mapActions("locations", ["createLocation", "updateLocation"]),
    async saveLocation() {
      if (this.$refs.locationForm.validate()) {
        const location = this.locationToSave;
        try {
          const { nativeId } = location;
          const res = await this.$confirm(
            `¿Está seguro de guardar la ubicación '${nativeId}'?`,
            {
              title: "Advertencia"
            }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createLocation({ location });
            } else if (this.mode === "editar") {
              await this.updateLocation({ location });
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
    this.locationModel = { ...this.location };
  }
};
</script>
