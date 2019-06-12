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
          <v-btn dark icon @click="saveSupplier">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="supplierForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del proveedor</h3>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field
                v-model="supplierModel.name"
                label="Nombre"
                counter="100"
                hint="Por ejemplo, JGL-Consulting"
                :rules="nameRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field
                v-model="supplierModel.nativeId"
                label="Identificador"
                counter="20"
                hint="Por ejemplo, P001"
                :rules="nativeIdRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-autocomplete
                v-model="supplierModel.country"
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
                    :iso='$_.get(supplierModel.country, "iso", "Sin país")'
                    :title='$_.get(supplierModel.country, "name", "Sin país")'
                    :squared="false"
                  ></flag>
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 pa-2>
              <v-text-field
                v-model="supplierModel.address"
                label="Dirección"
                counter="255"
                hint="Por ejemplo, Av. Amistad 132"
                :rules="addressRules"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-divider class="mt-2 mb-4"></v-divider>
          <v-layout wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Contacto del proveedor</h3>
            </v-flex>
            <v-flex xs6 pa-2>
              <v-text-field
                v-model="supplierModel.contact.firstName"
                label="Nombres"
                counter="100"
                hint="Por ejemplo, Pepe"
                :rules="contactFirstnameRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 pa-2>
              <v-text-field
                v-model="supplierModel.contact.lastName"
                label="Apellidos"
                counter="100"
                hint="Por ejemplo, Grillo"
                :rules="contactLastnameRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs2 pa-2>
              <v-text-field
                v-model="supplierModel.contact.phone"
                label="Teléfono"
                counter="12"
                hint="Por ejemplo, 912789263"
                :rules="contactPhoneRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs10 pa-2>
              <v-text-field
                v-model="supplierModel.contact.email"
                label="Correo electrónico"
                counter="100"
                hint="Por ejemplo, pepe@proface.com.pe"
                :rules="contactEmailRules"
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
import {
  required,
  email,
  phone,
  maxLength,
  referenced
} from "@/util/validators";
export default {
  props: {
    supplier: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      supplierModel: {},
      valid: true
    };
  },
  watch: {
    supplier: {
      handler() {
        this.supplierModel = JSON.parse(JSON.stringify(this.supplier));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo proveedor";
      } else if (this.mode == "editar") {
        return "Editar proveedor";
      }
    },
    countryAutocompleteHint() {
      const { name, iso } = this.supplierModel.country || {};
      return name && iso ? `${name}, ${iso}` : "";
    },
    ...mapState("suppliers", ["supplierTypes", "countries"]),
    supplierToSave() {
      const { contact } = this.supplierModel;
      return JSON.parse(
        JSON.stringify({
          ...this.supplierModel,
          contacts: [contact],
          contact: undefined,
          accounts: []
        })
      );
    },
    countryRules() {
      return [value => referenced(value, "El país es requerido")];
    },
    nameRules() {
      return [
        value => required(value, "El nombre es requerido"),
        value => maxLength(value, "El nombre es demasiado grande", 100)
      ];
    },
    addressRules() {
      return [
        value => required(value, "La dirección es requerido"),
        value => maxLength(value, "La dirección es demasiado grande", 255)
      ];
    },
    nativeIdRules() {
      return [
        value => required(value, "El identificador es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    },
    contactFirstnameRules() {
      return [
        value => required(value, "El nombre del contacto es requerido"),
        value =>
          maxLength(value, "El nombre del contacto es demasiado grande", 100)
      ];
    },
    contactLastnameRules() {
      return [
        value =>
          maxLength(value, "El apellido del contacto es demasiado grande", 100)
      ];
    },
    contactPhoneRules() {
      return [
        value => maxLength(value, "El teléfono es demasiado grande", 12),
        value => phone(value, "El teléfono no es válido")
      ];
    },
    contactEmailRules() {
      return [
        value => email(value, "El correo no es válido"),
        value => maxLength(value, "El correo es demasiado grande", 100)
      ];
    }
  },
  methods: {
    ...mapActions("suppliers", ["createSupplier", "updateSupplier"]),
    async saveSupplier() {
      if (this.$refs.supplierForm.validate()) {
        const supplier = this.supplierToSave;
        try {
          const { name } = supplier;
          const res = await this.$confirm(
            `¿Está seguro de guardar al proveedor '${name}'?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createSupplier({ supplier });
            } else if (this.mode === "editar") {
              await this.updateSupplier({ supplier });
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
    this.supplierModel = { ...this.supplier };
  }
};
</script>
