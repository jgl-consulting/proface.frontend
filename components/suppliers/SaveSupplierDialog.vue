<template>
  <v-layout row justify-center>
    <v-dialog v-model="value" persistent transition="dialog-bottom-transition" width="750">
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
            <v-btn dark icon @click="saveSupplier">
              <v-icon>fa-save</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs6>
              <v-text-field 
                v-model="supplierModel.name"
                label="Nombre">
              </v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field 
                v-model="supplierModel.nativeId" 
                label="Id Local">
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field 
                v-model="supplierModel.address" 
                label="Dirección">
              </v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model="supplierModel.type"
                :items="supplierTypes"
                item-value="id"
                item-text="name"
                return-object
                label="Tipo">
              </v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    supplier: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      supplierModel: {}
    }
  },
  watch: {
    supplier: {
      handler() {
        this.supplierModel = { ... this.supplier };
      }
    }
  },
  computed: {
    title() {
      if(this.mode == 'nuevo') {
        return "Nuevo proveedor";
      } else if (this.mode == 'editar') {
        return "Editar proveedor";
      }
    },
    ...mapState('suppliers', [
      'supplierTypes'
    ])
  },
  methods: {
    saveSupplier() {
      this.$emit('save', { ... this.supplierModel });
      this.closeDialog();
    },
    closeDialog() {
      this.isOpen = false;
      this.$emit("input", this.isOpen);
    }
  },
  created(){
    this.isOpen = this.value;
    this.supplierModel = { ... this.supplier };
  }
}
</script>
