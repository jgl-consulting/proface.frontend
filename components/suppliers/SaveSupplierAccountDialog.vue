<template>
  <v-dialog v-model="value" persistent width="700">
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
              <h3 class="text--blue-grey">
                Datos de la cuenta
              </h3>
            </v-flex>
            <v-flex sm8 pa-2>
              <v-select 
                v-model="supplierAccountModel.bank" 
                return-object
                itemid="id"
                item-text="name"
                :items="banks"
                label="Banco">
              </v-select>
            </v-flex>
            <v-flex sm4 pa-2>
              <v-select 
                v-model="supplierAccountModel.currency" 
                :items="currencies"
                item-value="id"
                item-text="name"
                label="Moneda">
              </v-select>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field 
                v-model="supplierAccountModel.number"
                label="Número de Cuenta"
                :mask="supplierAccountModel.bank.accountNumberMask"
                :rules="nroCtaRules">
              </v-text-field>
            </v-flex>
            <v-flex sm6 pa-2>
              <v-text-field 
                v-model="supplierAccountModel.cci" 
                label="CCI"
                mask="###-#################"
                :rules="cciRules">
              </v-text-field>
            </v-flex>
            <v-flex sm12 pa-2>
              <v-text-field 
                v-model="supplierAccountModel.description" 
                label="Descripción"
                :rules="descriptionRules">
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
import { required, maxLength } from '@/util/validators'

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
      currencies: [
        { id: 'PEN', name: 'Soles' },
        { id: 'USD', name: 'Dólares' },
      ]
    }
  },
  watch: {
    supplierAccount: {
      handler() {
        this.supplierAccountModel = JSON.parse(JSON.stringify(this.supplierAccount));
        if(!this.supplierAccountModel.bank || this.supplierAccountModel.bank.id === 0){ 
          this.supplierAccountModel.bank = this.banks || [{ id: 0 }];
        }
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
    ...mapState('suppliers/details', [
      'banks'
    ]),
    supplierAccountToSave(){
      return JSON.parse(JSON.stringify({ 
        ...this.supplierAccountModel,
      }));
    },
    nroCtaRules() {
      return [
        (value) => required(value, 'El número de cuenta es requerido')
      ]
    },
    cciRules() {
      return [
        (value) => required(value, 'El número de CCI es requerido')
      ]
    },
    descriptionRules() {
      return [
        (value) => maxLength(value, 'El valor supera el tamaño máximo', 45)
      ]
    }
  },
  methods: {
    ...mapActions('suppliers/details', [
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
      console.log({ error })
      const { message, errors } = this.$_.get(error, 'response.data', {
        message: 'Error inesperado',
        errors: [ error.message ]
      });

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
