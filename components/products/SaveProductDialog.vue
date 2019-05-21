<template>
  <v-dialog v-model="value" persistent width="850">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="text-weight-bold">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="saveProduct">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form ref="productForm" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del producto</h3>
            </v-flex>
            <v-flex xs8 pa-2>
              <v-text-field v-model="productModel.name" label="Nombre" :rules="nameproductRules"></v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field
                v-model="productModel.nativeId"
                label="Id Local"
                :rules="idproductRules"
              ></v-text-field>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-select
                v-model="productModel.currency"
                :items="currencies"
                item-value="id"
                item-text="name"
                label="Moneda"
                :rules="currencyRules"
              ></v-select>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field
                v-model="productModel.salePrice"
                label="Precio de Venta"
                :rules="salePriceRules"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-select
                v-model="productModel.line"
                :items="productLines"
                item-value="id"
                item-text="name"
                return-object
                label="Línea"
                :rules="lineRules"
              ></v-select>
            </v-flex>
            <v-flex xs12 pa-2>
              <v-text-field v-model="productModel.description" label="Descripción"></v-text-field>
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
    product: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      productModel: {},
      currencies: [
        { id: "PEN", name: "Nuevos Soles" },
        { id: "USD", name: "Dólares Americanos" },
        { id: "EUR", name: "Euros" }
      ]
    };
  },
  watch: {
    product: {
      handler() {
        this.productModel = JSON.parse(JSON.stringify(this.product));
      }
    }
  },
  computed: {
    title() {
      if (this.mode == "nuevo") {
        return "Nuevo producto";
      } else if (this.mode == "editar") {
        return "Editar producto";
      }
    },
    ...mapState("products", ["productLines"]),
    productToSave() {
      return JSON.parse(
        JSON.stringify({
          ...this.productModel
        })
      );
    },
    currencyRules() {
      return [value => required(value, "La moneda es requerida")];
    },
    salePriceRules() {
      return [value => required(value, "El precio de venta es requerido")];
    },
    lineRules() {
      return [value => referenced(value, "La línea de producto es requerida")];
    },
    idproductRules() {
      return [
        value => required(value, "El código del producto es requerido"),
        value => maxLength(value, "El valor supera el tamaño máximo", 20)
      ];
    },
    nameproductRules() {
      return [
        value => required(value, "El nombre del producto es requerido"),
        value => maxLength(value, "El valor supera el tamaño máximo", 300)
      ];
    }
  },
  methods: {
    ...mapActions("products", ["createProduct", "updateProduct"]),
    async saveProduct() {
      if (this.$refs.productForm.validate()) {
        const product = this.productToSave;
        try {
          const { name } = product;
          const res = await this.$confirm(
            `¿Está seguro de guardar el producto '${name}'?`,
            { title: "Advertencia" }
          );
          if (res) {
            if (this.mode === "nuevo") {
              await this.createProduct({ product });
            } else if (this.mode === "editar") {
              await this.updateProduct({ product });
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
    this.productModel = { ...this.product };
  }
};
</script>
