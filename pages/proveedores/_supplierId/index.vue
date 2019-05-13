<template>
  <v-card>
    <v-card-title primary-title>
      <h1>
        {{ supplier.name }}
        <flag
          class="ml-2"
          :iso="supplier.country.iso"
          :title="supplier.country.name"
          :squared="false"
        ></flag>
      </h1>
    </v-card-title>
    <v-layout row wrap>
        <v-flex xs7>
          <model-detail
            :fields="supplierFields"
            :model="supplier"
          ></model-detail>
        </v-flex>
        <v-flex xs5>
          <h2>Contacto</h2>
          <model-detail
            :fields="supplierContactFields"
            :model="supplierContact"
          ></model-detail>
        </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import ModelDetail from '@/components/suppliers/ModelDetail';
export default {
  async fetch({ params, route, store }) {
    const { supplierId } = params;  
    const supplier = await store.dispatch('suppliers/details/fetchSupplier', { 
      supplierId 
    })
    store.dispatch('addParams', [ supplier, route.path ]);
  },
  components: {
    ModelDetail
  },
  data(){
    return {
      supplierFields: [
        { key: 'nativeId', title: 'Código local', icon: 'fa-id-card-alt' },
        { key: 'address', title: 'Dirección', icon:'fa-map-marker-alt'},
        { 
          key: 'country', 
          title: 'Pais', 
          icon: 'fa-flag', 
          render: country => `${country.name}(${country.iso})` 
        },
        { 
          key: 'type', 
          title: 'Tipo', 
          icon: 'fa-globe-americas',
          render: type => type.name
        }
      ],
      supplierContactFields: [
        { key: 'fullName', title: 'Nombre y Apellido', icon: 'fa-user' },
        { key: 'phone', title: 'Teléfono', icon:'fa-phone'},
        { key: 'email', title: 'Correo electrónico', icon: 'fa-envelope'}
      ]
    }
  },
  computed: {
    ...mapState('suppliers/details', [
      'supplier'
    ]),
    supplierContact() {
      const contact = JSON.parse(JSON.stringify(this.supplier.contacts[0]));
      return {
        ...contact,
        fullName: `${contact.firstName} ${contact.lastName}`
      };
    }
  },
}
</script>