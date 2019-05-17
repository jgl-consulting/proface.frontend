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
          <v-btn dark icon @click="savePurchaseOrder">
            <v-icon>fa-save</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form>            
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <h3 class="text--blue-grey">Datos de la Orden de Compra</h3>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-text-field 
                v-model="purchaseOrderModel.nativeId" 
                label="Id Local">
              </v-text-field>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-menu
                v-model="menuCreation"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="209px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="purchaseOrderModel.creationDate"
                    label="Fecha de Creación"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker 
                  v-model="purchaseOrderModel.creationDate" @input="menuCreation = false">
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-menu
                v-model="menuQuotation"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="209px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="purchaseOrderModel.quotationDate"
                    label="Fecha de Creación"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker 
                  v-model="purchaseOrderModel.quotationDate" @input="menuQuotation = false">
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-menu
                v-model="menuBilling"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="209px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="purchaseOrderModel.billingDate"
                    label="Fecha de Creación"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker 
                  v-model="purchaseOrderModel.billingDate" @input="menuBilling = false">
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4 pa-2>
              <v-menu
                v-model="menuReception"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="209px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="purchaseOrderModel.receptionDate"
                    label="Fecha de Creación"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker 
                  v-model="purchaseOrderModel.receptionDate" @input="menuReception = false">
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4 pa-2>               
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
            <v-flex xs4 pa-2> 
              <v-select
                v-model="purchaseOrderModel.status"
                :items="purchaseStatuses"
                item-value="id"
                item-text="description"
                return-object
                label="Estado">
              </v-select>
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
