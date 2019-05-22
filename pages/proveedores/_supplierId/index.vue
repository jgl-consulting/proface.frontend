<template>
  <v-layout row wrap>
    <v-flex md6 px-2>
      <model-detail title="Información" :fields="supplierFields" :model="supplier"></model-detail>
      <model-detail title="Contacto" :fields="supplierContactFields" :model="supplierContact">
        <template v-slot:phone="{ field, model }">
          <v-list-tile-avatar>
            <v-icon small>{{ field.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ field.title }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ model[field.key] }}</v-list-tile-sub-title>
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
    </v-flex>
    <v-flex md6 px-2>
      <v-subheader>Último pedido</v-subheader>
      <model-timeline :fields="purchaseOrderFields" :model="supplierPurchaseOrder"></model-timeline>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ModelDetail from "@/components/common/ModelDetail";
import ModelTimeline from "@/components/common/ModelTimeline";
export default {
  async fetch({ params: { supplierId }, route, store }) {
    const fetchSupplierAction = "suppliers/details/fetchSupplier";
    await store.dispatch(fetchSupplierAction, { supplierId });
  },
  components: {
    ModelDetail,
    ModelTimeline
  },
  data() {
    return {
      supplierFields: [
        { key: "nativeId", title: "Código local", icon: "fa-id-card-alt" },
        { key: "address", title: "Dirección", icon: "fa-map-marker-alt" },
        {
          key: "country",
          title: "Pais",
          icon: "fa-flag",
          render: country => `${country.name}(${country.iso})`
        },
        {
          key: "type",
          title: "Tipo",
          icon: "fa-globe-americas",
          render: type => type.name
        }
      ],
      supplierContactFields: [
        { key: "fullName", title: "Nombre y Apellido", icon: "fa-user" },
        { key: "phone", title: "Teléfono", icon: "fa-phone" },
        { key: "email", title: "Correo electrónico", icon: "fa-envelope" }
      ],
      purchaseOrderFields: [
        {
          key: 1,
          value: "creationDate",
          title: "Fecha de Emisión",
          icon: "fa-calendar-plus"
        },
        {
          key: 2,
          value: "quotationDate",
          title: "Fecha de Presupuesto",
          icon: "fa-calendar-alt"
        },
        {
          key: 3,
          value: "billingDate",
          title: "Fecha de Facturación",
          icon: "fa-calendar-day"
        },
        {
          key: 4,
          value: "receptionDate",
          title: "Fecha de Recepción",
          icon: "fa-calendar-check"
        },
        {
          key: 5,
          value: "cancellationDate",
          title: "Fecha de Cancelación",
          icon: "fa-calendar-times"
        }
      ]
    };
  },
  computed: {
    ...mapState("suppliers/details", ["supplier"]),
    supplierContact() {
      if (this.supplier.contacts.length > 0) {
        const contact = JSON.parse(JSON.stringify(this.supplier.contacts[0]));
        return {
          ...contact,
          fullName: `${contact.firstName} ${contact.lastName}`
        };
      }
      return {};
    },
    supplierPurchaseOrder() {
      if (this.supplier.purchases.length > 0) {
        const [purchaseOrder] = this.supplier.purchases;
        return purchaseOrder;
      } else {
        return {};
      }
    }
  }
};
</script>
<style>
.v-subheader {
  text-transform: uppercase !important;
}
</style>
