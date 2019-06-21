<template>
  <v-form ref="batchForm" v-model="valid" lazy-validation>
    <v-layout row wrap>
      <h1>Registrar Empaque</h1>
      <v-spacer></v-spacer>
      <v-btn color="indigo darken-3" dark @click="saveBatch">
        <v-icon small>fa-save</v-icon>
        <span class="mx-1"></span>
        <span>Guardar Empaque</span>
      </v-btn>
    </v-layout>
    <form-group>
      <template #title>Datos del Empaque</template>
      <template #controls>
        <v-flex md4 pa-2>
          <v-text-field
            v-model="batch.nativeId"
            label="Identificador"
            counter="20"
            hint="Por ejemplo, PC00001"
            :rules="nativeIdRules"
          ></v-text-field>
        </v-flex>
        <v-flex md4 pa-2>
          <datepicker v-model="batch.entryDate" label="Fecha de Entrada"></datepicker>
        </v-flex>
        <v-flex md4 pa-2>
          <datepicker v-model="batch.expirationDate" label="Fecha de Expiración"></datepicker>
        </v-flex>
        <v-flex md4 pa-2>
          <v-autocomplete
            v-model="batch.purchase"
            :items="filteredPurchases"
            item-value="id"
            item-text="nativeId"
            :hint="purchaseAutocompleteHint"
            return-object
            label="Orden de Compra"
          ></v-autocomplete>
        </v-flex>
        <v-flex md4 pa-2>
          <v-select
            v-model="batch.type"
            :items="batchTypes"
            item-value="id"
            item-text="description"
            return-object
            :rules="typeRules"
            label="Tipo"
          ></v-select>
        </v-flex>
      </template>
    </form-group>
    <form-group>
      <template #title>Unidades</template>
      <template #actions>
        <v-btn color="accent" @click.stop="openProductList">
          <v-icon small>fa-plus</v-icon>
          <span class="mx-1"></span>
          <span>Nueva Unidad</span>
        </v-btn>
      </template>
      <template #controls>
        <v-flex xs12 px-2>
          <v-data-table
            :headers="unitHeaders"
            :items="batchItems"
            hide-actions
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td>
                <v-edit-dialog class="text-xs-left" large :return-value.sync="props.item.nativeId">
                  <span>
                    <v-icon small color="accent">fa-pen</v-icon>
                    <span class="ml-2">{{ props.item.nativeId || "Sin identificador" }}</span>
                  </span>
                  <template v-slot:input>
                    <v-text-field
                      type="text"
                      v-model="props.item.nativeId"
                      label="Identificador"
                      single-line
                      counter="20"
                      hint="Por ejemplo, U0001"
                      :rules="unitNativeIdRules"
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td>
                <v-edit-dialog class="text-xs-left" large :return-value.sync="props.item.location" lazy>
                  <span>
                    <v-icon small color="accent">fa-pen</v-icon>
                    <span class="ml-2">{{ $_.get(props.item.location, "description", "Sin ubicación") }}</span>
                  </span>
                  <template v-slot:input>
                    <v-select
                      v-model="props.item.location"
                      :items="locations"
                      item-value="id"
                      item-text="description"
                      return-object
                      :rules="unitLocationRules"
                      label="Ubicación"
                    ></v-select>
                  </template>
                </v-edit-dialog>
              </td>
              <td class="text-xs-center">
                <v-btn flat icon color="accent" @click="deleteBatchProduct(props.item)">
                  <v-icon small>fa-trash</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </template>
    </form-group>
    <!-- 
      Componete del listado de productos
      Tiene dos eventos:
      - @selectedProduct: Se emite cuando seleccionas un producto del modal y
      te devuelve ese producto
      - @changePagination: Se emite cuando cambias de página y sirve para contralar la
      paginación fuera del componente, ya que puede ser de que el listado de los productos
      lo almacenes en otro lugar del store
    -->
    <product-list-dialog
      v-model="productDialog"
      :products="nonSeletedProducts"
      :page="page"
      @selectedProduct="addProductToUnit"
      @changePagination="productListPaginationHandler"
    ></product-list-dialog>
  </v-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "@/components/common/FormGroup";
import Datepicker from "@/components/common/Datepicker";
import { required, maxLength, referenced } from "@/util/validators";
// Componente que maneja la tabla
import ProductListDialog from "@/components/products/ProductListDialog";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Empaques", link: "/almacen/empaques" }
    ]
  },
  components: {
    FormGroup,
    Datepicker,
    ProductListDialog
  },
  async fetch({ store }) {
    await store.dispatch('batches/addBatch/fetchLocations');
    await store.dispatch("batches/addBatch/fetchPurchaseOrders");
    await store.dispatch("batches/addBatch/fetchBatchTypes");
  },
  data() {
    return {
      productDialog: false,
      batch: {},
      batchItems: [],
      unitHeaders: [
        { sortable: false, key: "product", text: "Producto" },
        { sortable: false, key: "nativeId", text: "Identificador" },
        { sortable: false, key: "location", text: "Ubicación" },
        { sortable: false, key: "product", text: "¿Eliminar?", width: "10%" }
      ],
      valid: true
    };
  },
  computed: {
    nonSeletedProducts() {
      let sameProduct = (product, orderItem) => product.id === orderItem.id;
      return this.$_.differenceWith(
        this.products,
        this.batchItems,
        sameProduct
      );
    },
    filteredPurchases() {
      return this.purchaseOrders.filter(p => {
        let status = p.status;
        if(status) {
          return status.nativeId == "RE";
        } else {
          return false;
        }
      });
    },
    typeRules() {
      return [ value => required(value, "El tipo de empaque es requerido")];
    },
    unitNativeIdRules() {
      return [
        value => required(value, "El identificador de la unidad es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    },
    unitLocationRules() {
      return [ value => referenced(value, "La ubicación es requerida")];
    },
    nativeIdRules() {
      return [
        value => required(value, "El identificador es requerido"),
        value => maxLength(value, "El identificador es demasiado grande", 20)
      ];
    },
    title() {
      return "Nueva orden de compra";
    },
    purchaseAutocompleteHint() {
      const { nativeId } = this.batch.purchase || {};
      return nativeId ? nativeId : "";
    },
    ...mapState("batches/addBatch", [
      "products",
      "page",
      "purchaseOrders",
      "locations",
      "batchTypes",
    ]),
  },
  methods: {
    ...mapActions("batches", ["createBatch"]),
    openProductList() {
      this.productDialog = true;
    },
    async saveBatch() {
      if (this.$refs.batchForm.validate()) {
        const batch = this.batch;
        try {
          const { nativeId } = batch;
          const extractUnit = p => ({
            product: p,
            nativeId: p.nativeId,
            location: p.location,
          });
          if (this.batchItems) {
            batch.units = this.batchItems.map(extractUnit);
          }
          const res = await this.$confirm(
            `¿Está seguro de guardar el empaque '${nativeId}'?`,
            { title: "Advertencia" }
          );
          if (res) {
            await this.createBatch({ batch });
            await this.$confirm("Guardado correcto!", {
              title: "Éxito",
              color: "success"
            });
          }
        } catch (error) {
          this.showError(error);
        }
      } else {
        this.showError({
          response: {
            data: {
              message: "Error de Validación",
              errors: [{ errorMessage: "Existen campos que no son válidos." }]
            }
          }
        });
      }
    },
    /**
     * Métodos del componente ProductListDialog
     */

    // Maneja la paginación de forma externa para que el componente se pueda rehusar
    async productListPaginationHandler({
      sortBy,
      descending,
      page,
      rowsPerPage,
      filter
    }) {
      const params = {
        requestPage: page - 1,
        size: rowsPerPage,
        sortBy,
        descending,
        filter
      };
      await this.$store.dispatch(
        "batches/addBatch/fetchProducts",
        params
      );
    },
    // Añade un producto al detalle
    addProductToUnit(selectProduct) {
      this.batchItems.push({
        ...selectProduct,
        nativeId: "",
        location: {
          id: 0
        }
      });
    },
    showError(error) {
      const { message, errors } = error.response.data;
      this.$confirm(errors.map(e => e.errorMessage).join("\n"), {
        title: message,
        color: "error",
        width: 500
      });
    },
    deleteBatchProduct(product) {
      const productIdx = this.$_.findIndex(
        this.batchItems,
        item => item.id === product.id
      );
      this.$delete(this.batchItems, productIdx);
    }
  }
};
</script>