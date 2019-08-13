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
          <v-btn dark icon @click="saveBatch">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form>
          <form-group>
            <template #title>Datos del Empaque</template>
            <template #controls>
              <v-flex md4 pa-2>
                <v-text-field
                  v-model="batchModel.nativeId"
                  label="Identificador"
                  counter="20"
                  hint="Por ejemplo, PC00001"
                  :rules="nativeIdRules"
                ></v-text-field>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker v-model="batchModel.entryDate" label="Fecha de Entrada"></datepicker>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker v-model="batchModel.expirationDate" label="Fecha de Expiración"></datepicker>
              </v-flex>
              <v-flex md6 pa-2>
                <v-autocomplete
                  v-model="batchModel.purchase"
                  :items="filteredPurchases"
                  item-value="id"
                  item-text="nativeId"
                  :hint="purchaseAutocompleteHint"
                  return-object
                  label="Orden de Compra"
                ></v-autocomplete>
              </v-flex>
              <v-flex md6 pa-2>
                <v-select
                  v-model="batchModel.type"
                  :items="batchTypes"
                  item-value="id"
                  item-text="description"
                  return-object
                  :rules="typeRules"
                  label="Tipo"
                ></v-select>
              </v-flex>
            </template>
          </form-group>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required, maxLength } from "@/util/validators";
import FormGroup from "@/components/common/FormGroup";
import Datepicker from "@/components/common/Datepicker";
export default {
  components: {
    FormGroup,
    Datepicker
  },
  props: {
    batch: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      batchModel: {}
    };
  },
  watch: {
    batch: {
      handler() {
        this.batchModel = JSON.parse(JSON.stringify(this.batch));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo empaque";
      } else if (this.mode == "editar") {
        return "Editar empaque";
      }
    },
    purchaseAutocompleteHint() {
      const { nativeId } = this.batchModel.purchase || {};
      return nativeId ? nativeId : "";
    },
    ...mapState("batches", ["batchTypes", "purchaseOrders"]),
    filteredPurchases() {
      return this.purchaseOrders.filter(p => {
        let status = p.status;
        if (status) {
          return status.nativeId == "RE";
        } else {
          return false;
        }
      });
    },
    batchToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.batchModel
        })
      );
    },
    typeRules() {
      return [value => required(value, "El tipo de empaque es requerido")];
    },
    nativeIdRules() {
      return [
        value => required(value, "El identificador es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    }
  },
  methods: {
    ...mapActions("batches", ["createBatch", "updateBatch"]),
    async saveBatch() {
      const batch = this.batchToSave;
      try {
        const { nativeId } = batch;
        const res = await this.$confirm(
          `¿Está seguro de guardar el empaque '${nativeId}'?`,
          { title: "Advertencia" }
        );
        if (res) {
          if (this.mode === "nuevo") {
            await this.createBatch({ batch });
          } else if (this.mode === "editar") {
            await this.updateBatch({ batch });
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
    this.batchModel = { ...this.batch };
  }
};
</script>
