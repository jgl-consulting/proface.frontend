<template>
  <v-dialog v-model="value" persistent width="850">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">
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
        <v-form>            
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del proveedor</h3>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="supplierModel.name"
                label="Nombre">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="supplierModel.nativeId" 
                label="Id Local">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2> 
              <v-select
                v-model="supplierModel.type"
                :items="supplierTypes"
                item-value="id"
                item-text="name"
                return-object
                label="Tipo">
              </v-select>
            </v-flex>
            <v-flex xs8 pa-2>
              <v-text-field 
                v-model="supplierModel.address" 
                label="Dirección">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-autocomplete
                v-model="supplierModel.country"
                :items="countries"
                item-value="id"
                item-text="name"
                :hint="countryAutocompleteHint"
                return-object
                label="Pais">
                <template v-slot:append>
                  <flag
                    :iso="supplierModel.country.iso"
                    :title="supplierModel.country.name"
                    :squared="false"
                  ></flag>
                </template>
              </v-autocomplete>
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
                label="Nombres">
              </v-text-field>
            </v-flex>
            <v-flex xs6 pa-2>
              <v-text-field 
                v-model="supplierModel.contact.lastName" 
                label="Apellidos">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="supplierModel.contact.phone" 
                label="Teléfono">
              </v-text-field>
            </v-flex>
            <v-flex xs8 pa-2>
              <v-text-field 
                v-model="supplierModel.contact.email" 
                label="Correo electrónico">
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
        const [ country = {} ] = this.countries; 


        this.supplierModel = JSON.parse(JSON.stringify(this.supplier))
        this.supplierModel.country = this.supplier.country || country;
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
    countryAutocompleteHint() {
      const { name, iso } = this.supplierModel.country || {};
      return name && iso ? `${name}, ${iso}` : '';
    },
    ...mapState('suppliers', [
      'supplierTypes',
      'countries'
    ]),
    supplierToSave(){
      const { contact } = this.supplierModel;
      return JSON.parse(JSON.stringify({ 
        ...this.supplierModel, 
        contacts: [ contact ],
        contact: undefined,
        accounts: [] 
      }));
    }
  },
  methods: {
    ...mapActions('suppliers', [
      'createSupplier',
      'updateSupplier'
    ]),
    async saveSupplier() {
      const supplier = this.supplierToSave; 
      try {
        const { name } = supplier;
        const res = await this.$confirm(`¿Está seguro de guardar al proveedor '${name}'?`, { title: 'Advertencia' })
        if(res) {
          if(this.mode === 'nuevo') {
            await this.createSupplier({ supplier });
          } else if(this.mode === 'editar') {
            await this.updateSupplier({ supplier });
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
    this.supplierModel = { ... this.supplier };
  }
}
</script>
