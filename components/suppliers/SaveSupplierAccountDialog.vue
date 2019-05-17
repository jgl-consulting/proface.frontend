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
          <v-btn dark icon @click="saveSupplierAccount">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form>            
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos de la cuenta</h3>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="supplierAccountModel.number"
                label="Número de Cuenta">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="supplierAccountModel.cci" 
                label="CCI">
              </v-text-field>
            </v-flex>
            <v-flex xs8 pa-2>
              <v-text-field 
                v-model="supplierAccountModel.description" 
                label="Descripción">
              </v-text-field>
            </v-flex>
            <v-flex xs8 pa-2>
              <v-text-field 
                v-model="supplierAccountModel.currency" 
                label="Moneda">
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
    supplierAccount: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      supplierAccountModel: {}
    }
  },
  watch: {
    supplier: {
      handler() {
        const [ bank = {} ] = this.banks; 
        this.supplierAccountModel = JSON.parse(JSON.stringify(this.supplierAccount))
        this.supplierAccountModel.bank = this.supplierAccount.bank || bank;
      }
    }
  },
  computed: {
    title() {
      if(this.mode == 'nuevo') {
        return "Nueva cuenta";
      } else if (this.mode == 'editar') {
        return "Editar cuenta";
      }
    },
    ...mapState('supplierAccounts', [
      'banks'
    ]),
    supplierAccountToSave(){
      return JSON.parse(JSON.stringify({ 
        ...this.supplierAccountModel,
      }));
    }
  },
  methods: {
    ...mapActions('suppliersAccounts', [
      'createSupplierAccount',
      'updateSupplierAccount'
    ]),
    async saveSupplierAccount() {
      const supplierAccount = this.supplierAccountToSave; 
      try {
        const { number } = supplierAccount;
        const res = await this.$confirm(`¿Está seguro de guardar la cuenta '${number}'?`, { title: 'Advertencia' })
        if(res) {
          if(this.mode === 'nuevo') {
            await this.createSupplierAccount({ supplierAccount });
          } else if(this.mode === 'editar') {
            await this.updateSupplierAccount({ supplierAccount });
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
    this.supplierAccountModel = { ... this.supplierAccount };
  }
}
</script>
