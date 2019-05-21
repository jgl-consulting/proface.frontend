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
          <v-btn dark icon @click="savePurchaseOrder">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form>
          <form-group>
            <template #title>
              Datos de la Orden de Compra
            </template>
            <template #controls>
              <v-flex md6 pa-2>               
                <v-autocomplete
                  v-model="purchaseOrderModel.supplier"
                  :items="suppliers"
                  item-value="id"
                  item-text="name"
                  :hint="supplierAutocompleteHint"
                  return-object
                  label="Proveedor">
                </v-autocomplete>
              </v-flex>
              <v-flex md6 pa-2> 
                <v-select
                  v-model="purchaseOrderModel.status"
                  :items="purchaseStatuses"
                  item-value="id"
                  item-text="description"
                  return-object
                  label="Estado">
                </v-select>
              </v-flex>
              <v-flex md4 pa-2>
                <v-text-field 
                  v-model="purchaseOrderModel.nativeId" 
                  label="Identificador Local">
                </v-text-field>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker
                  v-model="purchaseOrderModel.creationDate"
                  label="Fecha de Creación"
                ></datepicker>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker
                  v-model="purchaseOrderModel.quotationDate"
                  label="Fecha de Cotización"
                ></datepicker>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker
                  v-model="purchaseOrderModel.billingDate"
                  label="Fecha de Facturación"
                ></datepicker>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker
                  v-model="purchaseOrderModel.receptionDate"
                  label="Fecha de Recepción"
                ></datepicker>
              </v-flex>
              <v-flex md4 pa-2>
                <datepicker
                  v-model="purchaseOrderModel.cancellationDate"
                  label="Fecha de Cancelación"
                ></datepicker>
              </v-flex>
            </template>
          </form-group>
          <!--form-group>
            <template #title>
              Productos
            </template>
            <template #controls>
              vDataTe
            </template>
          </form-group-->
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FormGroup from '@/components/common/FormGroup';
import Datepicker from '@/components/common/Datepicker';
export default {
  components: {
    FormGroup,
    Datepicker
  },
  props: {
    purchaseOrder: Object,
    mode: String,
    value: Boolean
  },
  data() {
    return {
      isOpen: false,
      purchaseOrderModel: {},
      menuCreation: false,
      menuQuotation: false,
      menuReception: false,
      menuBilling: false
    }
  },
  watch: {
    purchaseOrder: {
      handler() {
        const [ supplier = {} ] = this.suppliers; 
        this.purchaseOrderModel = JSON.parse(JSON.stringify(this.purchaseOrder))
        this.purchaseOrderModel.supplier = this.purchaseOrder.supplier || supplier;
      }
    }
  },
  computed: {
    title() {
      if(this.mode == 'nuevo') {
        return "Nueva orden de compra";
      } else if (this.mode == 'editar') {
        return "Editar orden de compra";
      }
    },
    supplierAutocompleteHint() {
      const { name } = this.purchaseOrderModel.supplier || {};
      return name  ? name : '';
    },
    ...mapState('purchaseOrders', [
      'purchaseStatuses',
      'suppliers'
    ]),
    purchaseOrderToSave(){
      return JSON.parse(JSON.stringify({ 
        ...this.purchaseOrderModel,
      }));
    }
  },
  methods: {
    ...mapActions('purchaseOrders', [
      'createPurchaseOrder',
      'updatePurchaseOrder'
    ]),
    async savePurchaseOrder() {
      const purchaseOrder = this.purchaseOrderToSave; 
      try {
        const { nativeId } = purchaseOrder;
        const res = await this.$confirm(`¿Está seguro de guardar la orden de compra '${nativeId}'?`, { title: 'Advertencia' })
        if(res) {
          if(this.mode === 'nuevo') {
            await this.createPurchaseOrder({ purchaseOrder });
          } else if(this.mode === 'editar') {
            await this.updatePurchaseOrder({ purchaseOrder });
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
    this.purchaseOrderModel = { ... this.purchaseOrder };
  }
}
</script>
