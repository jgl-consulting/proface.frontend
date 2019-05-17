<template>
  <v-dialog v-model="value" persistent width="850">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="text-weight-bold">
          {{ title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark icon @click="saveProduct">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form>            
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del producto</h3>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="productModel.name"
                label="Nombre">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="productModel.nativeId" 
                label="Id Local">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="productModel.salePrice" 
                label="Precio de Venta">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2> 
              <v-select
                v-model="productModel.line"
                :items="productLines"
                item-value="id"
                item-text="name"
                return-object
                label="Línea">
              </v-select>
            </v-flex>
            <v-flex xs8 pa-2>
              <v-text-field 
                v-model="productModel.description" 
                label="Descripción">
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  props: {
    product: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      productModel: {}
    }
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
      if(this.mode == 'nuevo') {
        return "Nuevo producto";
      } else if (this.mode == 'editar') {
        return "Editar producto";
      }
    },
    ...mapState('products', [
      'productLines'
    ]),
    productToSave(){
      return JSON.parse(JSON.stringify({ 
        ...this.productModel
      }));
    }
  },
  methods: {
    ...mapActions('products', [
      'createProduct',
      'updateProduct'
    ]),
    async saveProduct() {
      const product = this.productToSave; 
      try {
        const { name } = product;
        const res = await this.$confirm(`¿Está seguro de guardar el producto '${name}'?`, { title: 'Advertencia' })
        if(res) {
          if(this.mode === 'nuevo') {
            await this.createProduct({ product });
          } else if(this.mode === 'editar') {
            await this.updateProduct({ product });
          }
          await this.$confirm('Guardado correcto!', {
            title: 'Éxito',
            color: 'success'
          });

          this.closeDialog();
        }
      } catch(error) {
        this.showError(error);
      }
    },
    closeDialog() {
      this.isOpen = false;
      this.$emit("input", this.isOpen);
    },
    showError(error){
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join('\n'), { 
        title: message, 
        color: 'error',
        width: 500
      });
    }
  },
  created(){
    this.isOpen = this.value;
    this.productModel = { ... this.product };
  }
}
</script>
