<template>
  <v-form ref="purchaseOrderForm" v-model="valid" lazy-validation>
    <v-layout row wrap>
      <h1>Registrar Orden de Compra</h1>
      <v-spacer></v-spacer>
      <v-btn color="indigo darken-3" dark @click="savePurchaseOrder">
        <v-icon small>fa-save</v-icon>
        <span class="mx-1"></span>
        <span>Guardar Orden</span>
      </v-btn>
    </v-layout>
    <form-group>
      <template #title>Datos de la Orden de Compra</template>
      <template #controls>
        <v-flex md4 pa-2>
          <v-text-field
            v-model="purchaseOrder.nativeId"
            label="Identificador"
            counter="20"
            hint="Por ejemplo, OC00001"
            :rules="nativeIdRules"
          ></v-text-field>
        </v-flex>
        <v-flex md4 pa-2>
          <datepicker v-model="purchaseOrder.creationDate" label="Fecha de Creación"></datepicker>
        </v-flex>
        <v-flex md4 pa-2>
          <v-checkbox v-model="isAnOldPurchaseOrder" label="¿La orden compra es antigua?"></v-checkbox>
        </v-flex>
        <template v-if="isAnOldPurchaseOrder">
          <v-flex md4 pa-2>
            <v-autocomplete
              v-model="purchaseOrder.supplier"
              :items="suppliers"
              item-value="id"
              item-text="name"
              :hint="supplierAutocompleteHint"
              return-object
              label="Proveedor"
            ></v-autocomplete>
          </v-flex>
          <v-flex md4 pa-2>
            <v-select
              v-model="purchaseOrder.currency"
              :items="currencies"
              item-value="id"
              item-text="name"
              label="Moneda"
              return-object
            ></v-select>
          </v-flex>
          <v-flex md4 pa-2>
            <v-select
              v-model="purchaseOrder.status"
              :items="purchaseStatuses"
              item-value="id"
              item-text="description"
              return-object
              label="Estado"
            ></v-select>
          </v-flex>
        </template>
      </template>
    </form-group>
    <form-group>
      <template #title>Productos</template>
      <template #actions>
        <v-btn color="accent" @click.stop="openProductList">
          <v-icon small>fa-plus</v-icon>
          <span class="mx-1"></span>
          <span>Nuevo Producto</span>
        </v-btn>
      </template>
      <template #controls>
        <v-flex xs12 px-2>
          <v-data-table
            :headers="detailHeaders"
            :items="purchaseOrderItems"
            hide-actions
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td>
                <v-edit-dialog class="text-xs-left" :return-value.sync="props.item.unitPrice">
                  <span>
                    <v-icon small color="accent">fa-pen</v-icon>
                    <span class="ml-2">{{ props.item.unitPrice }}</span>
                  </span>
                  <template v-slot:input>
                    <v-text-field
                      type="number"
                      v-model="props.item.unitPrice"
                      label="Precio Unitario"
                      single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td>
                <v-edit-dialog class="text-xs-left" :return-value.sync="props.item.quantity" lazy>
                  <span>
                    <v-icon small color="accent">fa-pen</v-icon>
                    <span class="ml-2">{{ props.item.quantity }} unidades</span>
                  </span>
                  <template v-slot:input>
                    <v-text-field
                      type="number"
                      v-model="props.item.quantity"
                      label="Cantidad"
                      single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td
                class="text-xs-left"
              >{{ (props.item.unitPrice * props.item.quantity) | twoDecimals}}</td>
              <td>
                <v-edit-dialog class="text-xs-left" :return-value.sync="props.item.disscount" lazy>
                  <span>
                    <v-icon small color="accent">fa-pen</v-icon>
                    <span class="ml-2">{{ props.item.disscount }}</span>
                  </span>
                  <template v-slot:input>
                    <v-text-field
                      type="number"
                      v-model="props.item.disscount"
                      label="Descuento"
                      single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td
                class="text-xs-left"
              >{{ (props.item.unitPrice * props.item.quantity - props.item.disscount) | twoDecimals }}</td>
              <td class="text-xs-center">
                <v-btn fab dark small color="accent" @click="deleteOrderProduct(props.item)">
                  <v-icon small>fa-trash</v-icon>
                </v-btn>
              </td>
            </template>
            <template #footer>
              <td class="text-sm-right" :colspan="detailHeaders.length">
                <h3>Total: {{ purchaseOrderAmount | twoDecimals }}</h3>
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
      @selectedProduct="addProductToDetail"
      @changePagination="productListPaginationHandler"
    ></product-list-dialog>
  </v-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormGroup from "@/components/common/FormGroup";
import Datepicker from "@/components/common/Datepicker";
import { required, maxLength } from "@/util/validators";
// Componente que maneja la tabla
import ProductListDialog from "@/components/products/ProductListDialog";
export default {
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Órdenes de Compra", link: "/compras/ordenesCompra" }
    ]
  },
  components: {
    FormGroup,
    Datepicker,
    ProductListDialog
  },
  async fetch({ store }) {
    //await store.dispatch('purchaseOrders/addOrder/fetchProducts');
    await store.dispatch("purchaseOrders/addOrder/fetchPurchaseStatuses");
    await store.dispatch("purchaseOrders/addOrder/fetchSuppliers");
    await store.dispatch("purchaseOrders/addOrder/fetchCurrencies");
  },
  data() {
    return {
      productDialog: false,
      isAnOldPurchaseOrder: false,
      purchaseOrder: {},
      purchaseOrderItems: [],
      detailHeaders: [
        { sortable: false, key: "name", text: "Producto" },
        { sortable: false, key: "unitPrice", text: "Precio unitario" },
        { sortable: false, key: "quantity", text: "Cantidad" },
        { sortable: false, key: "purchasePrice", text: "Precio de compra" },
        { sortable: false, key: "disscount", text: "Descuento" },
        { sortable: false, key: "finalPrice", text: "Precio final" },
        { sortable: false, key: "product", text: "¿Eliminar?" }
      ],
      valid: true
    };
  },
  computed: {
    nonSeletedProducts() {
      let sameProduct = (product, orderItem) => product.id === orderItem.id;
      return this.$_.differenceWith(
        this.products,
        this.purchaseOrderItems,
        sameProduct
      );
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
    supplierAutocompleteHint() {
      const { name } = this.purchaseOrder.supplier || {};
      return name ? name : "";
    },
    ...mapState("purchaseOrders/addOrder", [
      "products",
      "page",
      "purchaseStatuses",
      "suppliers",
      "currencies"
    ]),
    purchaseOrderAmount() {
      let addItemToTotalAmount = (
        totalAmount,
        { quantity, unitPrice, disscount }
      ) => {
        return totalAmount + unitPrice * quantity - disscount;
      };
      return this.purchaseOrderItems.reduce(addItemToTotalAmount, 0);
    }
  },
  methods: {
    ...mapActions("purchaseOrders", ["createPurchaseOrder"]),
    openProductList() {
      this.productDialog = true;
    },
    async savePurchaseOrder() {
      if (this.$refs.purchaseOrderForm.validate()) {
        const purchaseOrder = this.purchaseOrder;
        try {
          const { nativeId } = purchaseOrder;
          const extractDetail = p => ({
            product: {
              id: p.id
            },
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            disscount: p.disscount
          });
          if (this.purchaseOrderItems) {
            purchaseOrder.details = this.purchaseOrderItems.map(extractDetail);
          }
          const res = await this.$confirm(
            `¿Está seguro de guardar la orden de compra '${nativeId}'?`,
            { title: "Advertencia" }
          );
          if (res) {
            await this.createPurchaseOrder({ purchaseOrder });
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
        "purchaseOrders/addOrder/fetchProducts",
        params
      );
    },
    // Añade un producto al detalle
    addProductToDetail(selectProduct) {
      this.purchaseOrderItems.push({
        ...selectProduct,
        quantity: 1,
        unitPrice: 0,
        purchasePrice: 0,
        disscount: 0,
        finalPrice: 0
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
    deleteOrderProduct(product) {
      const productIdx = this.$_.findIndex(
        this.purchaseOrderItems,
        item => item.id === product.id
      );
      this.$delete(this.purchaseOrderItems, productIdx);
    }
  }
};
</script>