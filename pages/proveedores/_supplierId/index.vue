<template>
  <v-card>
    <v-card-title primary-title>
      <h1 class="headline-1 ma-2">
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
        <v-flex md6 pa-4>
          <v-card flat class="elevation-3">
            <v-toolbar dark color="deep-purple darken-2">
               <h2>Información General</h2>
            </v-toolbar>
            <v-card-text>
              <model-detail
                :fields="supplierFields"
                :model="supplier"
              ></model-detail>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md6 pa-4>
          <v-card flat class="elevation-3">
            <v-toolbar dark color="accent">
              <h2>Contacto</h2>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
            <model-detail
              :fields="supplierContactFields"
              :model="supplierContact"
            >
              <template v-slot:phone="{ field, model }">
                <v-list-tile-avatar>
                  <v-icon small>{{ field.icon }}</v-icon>
                </v-list-tile-avatar> 
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ field.title }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ model[field.key] }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                      <v-btn icon v-on="on">
                        <v-icon small>fa-clone</v-icon>
                      </v-btn>
                    </template>
                    Copia al portapapeles
                  </v-tooltip>    
                </v-list-tile-action>            
              </template>
            </model-detail>
            </v-card-text>
          </v-card>
         
        </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
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