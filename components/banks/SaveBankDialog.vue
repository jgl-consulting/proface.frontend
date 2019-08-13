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
          <v-btn dark icon @click="saveBank">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="bankForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del banco</h3>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field
                v-model="bankModel.name"
                label="Nombre"
                counter="45"
                :rules="nameRules"
                hint="Por ejemplo, Banco Pichincha"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-autocomplete
                v-model="bankModel.country"
                :items="countries"
                item-value="id"
                item-text="name"
                :hint="countryAutocompleteHint"
                :rules="countryRules"
                return-object
                label="Pais"
              >
                <template v-slot:append>
                  <flag
                    :iso="bankModel.country.iso"
                    :title="bankModel.country.name"
                    :squared="false"
                  ></flag>
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="bankModel.accountNumberMask"
                counter="20"
                hint="Por ejemplo, ####-####-###"
                label="Máscara de Números de Cuenta"
                :rules="maskRules"
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
import { required, referenced, maxLength } from "@/util/validators";

export default {
  props: {
    bank: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      bankModel: {},
      valid: true
    };
  },
  watch: {
    bank: {
      handler() {
        const [country = {}] = this.countries;
        this.bankModel = JSON.parse(JSON.stringify(this.bank));
        this.bankModel.country = this.bank.country || country;
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo banco";
      } else if (this.mode == "editar") {
        return "Editar banco";
      }
    },
    countryAutocompleteHint() {
      const { name, iso } = this.bankModel.country || {};
      return name && iso ? `${name}, ${iso}` : "";
    },
    ...mapState("banks", ["countries"]),
    bankToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.bankModel
        })
      );
    },
    countryRules() {
      return [value => referenced(value, "El país es requerido")];
    },
    nameRules() {
      return [
        value => required(value, "El nombre es requerido"),
        value => maxLength(value, "El nombre es demasiado grande", 45)
      ];
    },
    maskRules() {
      return [value => maxLength(value, "La máscara es demasiado grande", 20)];
    }
  },
  methods: {
    ...mapActions("banks", ["createBank", "updateBank"]),
    async saveBank() {
      if (this.$refs.bankForm.validate()) {
        const bank = this.bankToSave;
        try {
          const { name } = bank;
          const res = await this.$confirm(
            `¿Está seguro de guardar el banco '${name}'?`,
            {
              title: "Advertencia"
            }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createBank({ bank });
            } else if (this.mode === "editar") {
              await this.updateBank({ bank });
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
    this.bankModel = { ...this.bank };
  }
};
</script>
