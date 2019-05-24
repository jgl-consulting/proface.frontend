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
          <v-btn dark icon @click="saveSupplierAccount">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="supplierAccountForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos de la cuenta</h3>
            </v-flex>
            <v-flex sm8 pa-2>
              <v-select
                v-model="supplierAccountModel.bank"
                return-object
                itemid="id"
                item-text="name"
                :items="banks"
                label="Banco"
                :rules="bankRules"
              ></v-select>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-select
                v-model="supplierAccountModel.currency"
                :items="currencies"
                item-value="id"
                item-text="name"
                label="Moneda"
                return-object
                :rules="currencyRules"
              ></v-select>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field
                v-model="supplierAccountModel.number"
                label="Número de Cuenta"
                :mask="supplierAccountModel.bank.accountNumberMask"
                :rules="nroCtaRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field
                v-model="supplierAccountModel.cci"
                label="CCI"
                mask="###-#################"
                :rules="cciRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field
                v-model="supplierAccountModel.description"
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
import { required, maxLength, referenced } from "@/util/validators";
export default {
  props: {
    supplierAccount: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      supplierAccountModel: {},
      valid: true
    };
  },
  watch: {
    supplierAccount: {
      handler() {
        const [bank = {}] = this.banks;
        this.supplierAccountModel = JSON.parse(
          JSON.stringify(this.supplierAccount)
        );
        this.supplierAccountModel.bank = this.supplierAccount.bank || bank;
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nueva cuenta";
      } else if (this.mode == "editar") {
        return "Editar cuenta";
      }
    },
    ...mapState("suppliers/details", ["banks", "currencies"]),
    supplierAccountToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.supplierAccountModel
        })
      );
    },
    bankRules() {
      return [value => referenced(value, "El banco es requerido")];
    },
    currencyRules() {
      return [value => required(value, "La moneda es requerida")];
    },
    nroCtaRules() {
      return [value => required(value, "El número de cuenta es requerido")];
    },
    cciRules() {
      return [value => required(value, "El número de CCI es requerido")];
    },
    descriptionRules() {
      return [
        value => maxLength(value, "El valor supera el tamaño máximo", 45)
      ];
    }
  },
  methods: {
    ...mapActions("suppliers/details", [
      "createSupplierAccount",
      "updateSupplierAccount"
    ]),
    async saveSupplierAccount() {
      if (this.$refs.supplierAccountForm.validate()) {
        const supplierAccount = this.supplierAccountToSave;
        try {
          const { number } = supplierAccount;
          const res = await this.$confirm(
            `¿Está seguro de guardar la cuenta '${number}'?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createSupplierAccount({ supplierAccount });
            } else if (this.mode === "editar") {
              await this.updateSupplierAccount({ supplierAccount });
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
    this.supplierAccountModel = { ...this.supplierAccount };
  }
};
</script>
