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
      <v-timeline align-top dense>
        <v-timeline-item color="accent" small>
          <v-layout pt-3>
            <v-flex xs3>
              <strong>5pm</strong>
            </v-flex>
            <v-flex>
              <strong>New Icon</strong>
              <div class="caption">Mobile App</div>
            </v-flex>
          </v-layout>
        </v-timeline-item>
        <v-timeline-item color="deep-purple darken-2" small>
          <v-layout wrap pt-3>
            <v-flex xs3>
              <strong>3-4pm</strong>
            </v-flex>
            <v-flex>
              <strong>Design Stand Up</strong>
              <div class="caption mb-2">Hangouts</div>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                ></v-img>
              </v-avatar>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"
                ></v-img>
              </v-avatar>
              <v-avatar>
                <v-img
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"
                ></v-img>
              </v-avatar>
            </v-flex>
          </v-layout>
        </v-timeline-item>
        <v-timeline-item color="accent" small>
          <v-layout pt-3>
            <v-flex xs3>
              <strong>12pm</strong>
            </v-flex>
            <v-flex>
              <strong>Lunch break</strong>
            </v-flex>
          </v-layout>
        </v-timeline-item>
        <v-timeline-item color="deep-purple darken-2" small>
          <v-layout pt-3>
            <v-flex xs3>
              <strong>9-11am</strong>
            </v-flex>
            <v-flex>
              <strong>Finish Home Screen</strong>
              <div class="caption">Web App</div>
            </v-flex>
          </v-layout>
        </v-timeline-item>
      </v-timeline>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import ModelDetail from "@/components/suppliers/ModelDetail";
export default {
  async fetch({ params: { supplierId }, route, store }) {
    const fetchSupplierAction = "suppliers/details/fetchSupplier";
    await store.dispatch(fetchSupplierAction, { supplierId });
  },
  components: {
    ModelDetail
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
      ]
    };
  },
  computed: {
    ...mapState("suppliers/details", ["supplier"]),
    supplierContact() {
      if (this.supplier.contacts.lenght > 0) {
        const contact = JSON.parse(JSON.stringify(this.supplier.contacts[0]));
        return {
          ...contact,
          fullName: `${contact.firstName} ${contact.lastName}`
        };
      }
      return {};
    }
  }
};
</script>
<style>
.v-subheader {
  text-transform: uppercase !important;
}
</style>
