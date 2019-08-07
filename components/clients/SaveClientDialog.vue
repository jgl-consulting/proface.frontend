<template>
  <v-dialog v-model="value" persistent width="850">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="saveClient">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="clientForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del cliente</h3>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field
                v-model="clientModel.name"
                label="Nombre"
                counter="100"
                hint="Por ejemplo, JGL-Consulting"
                :rules="nameRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field
                v-model="clientModel.nativeId"
                label="Identificador"
                counter="20"
                hint="Por ejemplo, C001"
                :rules="nativeIdRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-autocomplete
                v-model="clientModel.type"
                :items="clientTypes"
                item-value="id"
                item-text="name"
                :hint="typeAutocompleteHint"
                :rules="typeRules"
                return-object
                label="Tipo"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs8 pa-2>
              <v-text-field
                v-model="clientModel.address"
                label="Dirección"
                counter="255"
                hint="Por ejemplo, Av. Amistad 132"
                :rules="addressRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field
                v-model="clientModel.district"
                label="Distrito"
                counter="100"
                hint="Por ejemplo, Av. Amistad 132"
                :rules="districtRules"
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
    client: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      clientModel: {},
      valid: true
    };
  },
  watch: {
    client: {
      handler() {
        this.clientModel = JSON.parse(JSON.stringify(this.client));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo cliente";
      } else if (this.mode == "editar") {
        return "Editar cliente";
      }
    },
    typeAutocompleteHint() {
      const { name } = this.clientModel.type || {};
      return name ? `${name}` : "";
    },
    ...mapState("clients", ["clientTypes"]),
    clientToSave() {
      const { contact } = this.clientModel;
      return JSON.parse(
        JSON.stringify({
          ...this.clientModel
        })
      );
    },
    typeRules() {
      return [value => referenced(value, "El tipo de cliente es requerido")];
    },
    districtRules() {
      return [
        value => maxLength(value, "El distrito es demasiado grande", 100)
      ];
    },
    nameRules() {
      return [
        value => required(value, "El nombre es requerido"),
        value => maxLength(value, "El nombre es demasiado grande", 100)
      ];
    },
    addressRules() {
      return [
        value => maxLength(value, "La dirección es demasiado grande", 255)
      ];
    },
    nativeIdRules() {
      return [
        value => required(value, "El identificador es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    }
  },
  methods: {
    ...mapActions("clients", ["createClient", "updateClient"]),
    async saveClient() {
      if (this.$refs.clientForm.validate()) {
        const client = this.clientToSave;
        try {
          const { name } = client;
          const res = await this.$confirm(
            `¿Está seguro de guardar al cliente '${name}'?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createClient({ client });
            } else if (this.mode === "editar") {
              await this.updateClient({ client });
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
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    }
  },
  created() {
    this.isOpen = this.value;
    this.clientModel = { ...this.client };
  }
};
</script>
