<template>
  <v-layout row wrap>
      <v-flex md6 px-2>
        <model-detail
          title="Información"
          :fields="purchaseOrderFields"
          :model="purchaseOrder"
        ></model-detail>
      </v-flex>
      <v-flex md6 px-2>
        <v-subheader>
          Estado
        </v-subheader>
        <v-timeline
          align-top
          dense
        >
          <v-timeline-item
            color="accent"
            small
          >
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

          <v-timeline-item
            color="deep-purple darken-2"
            small
          >
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

          <v-timeline-item
            color="accent"
            small
          >
            <v-layout pt-3>
              <v-flex xs3>
                <strong>12pm</strong>
              </v-flex>
              <v-flex>
                <strong>Lunch break</strong>
              </v-flex>
            </v-layout>
          </v-timeline-item>

          <v-timeline-item
            color="deep-purple darken-2"
            small
          >
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
import { mapState } from 'vuex';
import ModelDetail from '@/components/purchaseOrders/ModelDetail';

export default {
  async fetch({ params: { purchaseOrderId }, route, store }) {
    const fetchPurchaseOrderAction ='purchaseOrders/details/fetchPurchaseOrder';
    await store.dispatch(fetchPurchaseOrderAction, { purchaseOrderId });
  },
  components: {
    ModelDetail
  },
  data(){
    return {
      purchaseOrderFields: [
        { key: 'nativeId', title: 'Código local', icon: 'fa-id-card-alt' },
        { key: 'creationDate', title: 'Fecha de Creación', icon:'fa-calendar-plus'},
        { key: 'quotationDate', title: 'Fecha de Presupuesto', icon:'fa-calendar-alt'},
        { key: 'billingDate', title: 'Fecha de Facturación', icon:'fa-calendar-day'},
        { key: 'receptionDate', title: 'Fecha de Recepción', icon:'fa-calendar-check'},
        { key: 'cancellationDate', title: 'Fecha de Cancelación', icon:'fa-calendar-times'},
        { 
          key: 'supplier', 
          title: 'Proveedor', 
          icon: 'fa-truck', 
          render: supplier => supplier.name 
        }
      ]
    }
  },
  computed: {
    ...mapState('purchaseOrders/details', [
      'purchaseOrder'
    ])
  },
}
</script>
<style>
  .v-subheader {
    text-transform: uppercase !important;
  }
</style>
