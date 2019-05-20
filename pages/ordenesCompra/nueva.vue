<template>
  <v-form>
    <form-group>
      <template #title>
        Datos de la Orden de Compra
      </template>
      <template #controls>
        <v-flex md3 pa-2>
          <v-text-field 
            v-model="purchaseOrder.nativeId" 
            label="Identificador Local">
          </v-text-field>
        </v-flex>
        <v-flex md5 pa-2>               
          <v-autocomplete
            v-model="purchaseOrder.supplier"
            :items="suppliers"
            item-value="id"
            item-text="name"
            :hint="supplierAutocompleteHint"
            return-object
            label="Proveedor">
          </v-autocomplete>
        </v-flex>
        <v-flex md4 pa-2> 
          <v-select
            v-model="productoToAdd"
            :items="purchaseStatuses"
            item-value="id"
            item-text="description"
            return-object
            label="Estado">
          </v-select>
        </v-flex>
        <v-flex md3 pa-2>
          <datepicker
            v-model="purchaseOrder.creationDate"
            label="Fecha de Creación"
          ></datepicker>
        </v-flex>
        <v-flex md3 pa-2>
          <datepicker
            v-model="purchaseOrder.quotationDate"
            label="Fecha de Cotización"
          ></datepicker>
        </v-flex>
        <v-flex md3 pa-2>
          <datepicker
            v-model="purchaseOrder.billingDate"
            label="Fecha de Facturación"
          ></datepicker>
        </v-flex>
        <v-flex md3 pa-2>
          <datepicker
            v-model="purchaseOrder.receptionDate"
            label="Fecha de Recepción"
          ></datepicker>
        </v-flex>
      </template>
    </form-group>
    <form-group>
      <template #title>
        Productos
      </template>
      <template #actions>
        <v-btn color="accent" @click.stop="productDialog = true">
          <v-icon small>fa-plus</v-icon>
          <span class="mx-1"></span>
          <span>Nuevo Producto</span>
        </v-btn>
      </template>
      <template #controls>
        <v-flex xs12>
          <v-data-table
            :headers="detailHeaders"
            :items="detailItems"
            hide-actions
            class="elevation-1"
          ></v-data-table>
        </v-flex>
      </template>
    </form-group>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FormGroup from '@/components/common/FormGroup';
import Datepicker from '@/components/common/Datepicker';
export default {
  meta: {
    breadcrumbs: false,
  },
  components: {
    FormGroup,
    Datepicker
  },
  async fetch({ store }) {
    await state.dispatch('purchaseOrders/addOrder/fetchProducts');
  },
  data() {
    return {
      productDialog: false,
      purchaseOrder: {},
      productoToAdd: {},
      detailHeaders: [
        { key: 'product', text: 'Producto' },
        { key: 'qty', text: 'Cantidad' },
        { key: 'product', text: '¿Eliminar?' }
      ]
    }
  },
  computed: {
    title() {
      return "Nueva orden de compra";
    },
    supplierAutocompleteHint() {
      const { name } = this.purchaseOrder.supplier || {};
      return name  ? name : '';
    },
    ...mapState('purchaseOrders', [
      'purchaseStatuses',
      'suppliers'
    ])
  },
  methods: {
    ...mapActions('purchaseOrders', [
      'createPurchaseOrder'
    ]),
    async savePurchaseOrder() {
      const purchaseOrder = this.purchaseOrder; 
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
        }
      } catch(error) {
        this.showError(error);
      }
    },
    showError(error){
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join('\n'), { 
        title: message, 
        color: 'error',
        width: 500
      });
    }
  }
}
</script>