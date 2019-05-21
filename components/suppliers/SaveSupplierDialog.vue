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
        <v-form ref="supplierForm" v-model="valid" lazy-validation>            
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos del proveedor</h3>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="supplierModel.name"
                label="Nombre"
                :rules="nameRules">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="supplierModel.nativeId" 
                label="Id Local"
                :rules="nativeIdRules">
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
            <!-- verificar o borrar
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
           verificar o borrar-->
            <v-flex xs12 pa-2>
              <v-text-field 
                v-model="supplierModel.address" 
                label="Dirección"
                :rules="addressRules">
              </v-text-field>
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
                :rules="contactFirstnameRules">
              </v-text-field>
            </v-flex>
            <v-flex xs6 pa-2>
              <v-text-field 
                v-model="supplierModel.contact.lastName" 
                label="Apellidos"
                :rules="contactLastnameRules">
              </v-text-field>
            </v-flex>
            <v-flex xs2 pa-2>
              <v-text-field 
                v-model="supplierModel.contact.phone" 
                label="Teléfono"
                :rules="contactPhoneRules">
              </v-text-field>
            </v-flex>
            <v-flex xs10 pa-2>
              <v-text-field 
                v-model="supplierModel.contact.email" 
                label="Correo electrónico"
                :rules="contactEmailRules">
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
import { required, email, phone, maxLength } from '@/util/validators'
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
    },
    nameRules() {
      return [
        (value) => required(value, 'El nombre es requerido'),
        (value) => maxLength(value, 'El valor supera el tamaño máximo', 45)
      ]
    },
    addressRules() {
      return [
        (value) => required(value, 'La dirección es requerido'),
        (value) => maxLength(value, 'El valor supera el tamaño máximo', 100)
      ]
    },
    nativeIdRules(){
      return [
        (value) => required(value, 'El id local es requerido'),
        (value) => maxLength(value, 'El valor supera el tamaño máximo', 20)
      ]
    },
    contactFirstnameRules() {
      return [
        (value) => required(value, 'El nombre del contacto es requerido'),
        (value) => maxLength(value, 'El valor supera el tamaño máximo', 45)
     
      ]
    },
    contactLastnameRules() {
      return [
        (value) => required(value, 'El apellido del contacto es requerido'),
        (value) => maxLength(value, 'El valor supera el tamaño máximo', 45)
     
      ]
    },
    contactPhoneRules() {
      return [
        (value) => required(value, 'El teléfono es requerido'),
        (value) => phone(value, 'El teléfono no es válido')
      ]
    },
    contactEmailRules() {
      return [
        (value) => required(value, 'El correo es requerido'),
        (value) => email(value, 'El correo no es válido'),
        (value) => maxLength(value, 'El valor supera el tamaño máximo', 50)
      ]
    }
  },
  methods: {
    ...mapActions('suppliers', [
      'createSupplier',
      'updateSupplier'
    ]),
    async saveSupplier() {
      if(this.$refs.supplierForm.validate()) {
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
