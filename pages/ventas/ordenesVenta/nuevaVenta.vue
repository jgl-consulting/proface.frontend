<template>
  <v-form ref="saleOrderForm" v-model="valid" lazy-validation>
    <v-layout row wrap>
      <h1>Registrar Orden de Venta</h1>
      <v-spacer></v-spacer>
      <v-btn color="indigo darken-3" dark @click="saveSaleOrder">
        <v-icon small>fa-save</v-icon>
        <span class="mx-1"></span>
        <span>Guardar Orden</span>
      </v-btn>
    </v-layout>
    <form-group>
      <template #title>Datos de la Orden de Venta</template>
      <template #controls>
        <v-flex md4 pa-2>
          <v-text-field
            v-model="saleOrder.nativeId"
            label="Identificador"
            counter="20"
            hint="Por ejemplo, OV00001"
            :rules="nativeIdRules"
          ></v-text-field>
        </v-flex>
        <v-flex md4 pa-2>
          <datepicker v-model="saleOrder.creationDate" label="Fecha de Creación"></datepicker>
        </v-flex>
        <v-flex md4 pa-2>
        <v-autocomplete
            v-model="saleOrder.client"
            :items="clients"
            item-value="id"
            item-text="name"
            :hint="clientAutocompleteHint"
            return-object
            label="Cliente"
        ></v-autocomplete>
        </v-flex>
        <v-flex md4 pa-2>
        <v-select
            v-model="saleOrder.user"
            :items="users"
            item-value="id"
            item-text="firstName"
            label="Vendedor"
            return-object
        ></v-select>
        </v-flex>
        <v-flex md4 pa-2>
        <v-select
            v-model="saleOrder.status"
            :items="saleStatuses"
            item-value="id"
            item-text="description"
            return-object
            label="Estado"
        ></v-select>
        </v-flex>
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
                :items="saleOrderItems"
                hide-actions
                class="elevation-1"
            >
                <template v-slot:items="props">
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.unitPrice }}</td>
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
                    <v-btn flat icon color="accent" @click="deleteOrderProduct(props.item)">
                    <v-icon small>fa-trash</v-icon>
                    </v-btn>
                </td>
                </template>
                <template #footer>
                <td class="text-sm-right" :colspan="detailHeaders.length">
                    <h3>Total: {{ saleOrderAmount | twoDecimals }}</h3>
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
import salePerimeter from '@/security/perimeters/sale-perimeter';
import { mapState, mapActions } from "vuex";
import FormGroup from "@/components/common/FormGroup";
import Datepicker from "@/components/common/Datepicker";
import { required, maxLength } from "@/util/validators";
// Componente que maneja la tabla
import ProductListDialog from "@/components/products/ProductListDialog";
export default {
  routePerimeterAction: 'registerSale',
  perimeters: [
    salePerimeter
  ],
  meta: {
    breadcrumbs: [
      { name: "Módulos", link: "/" },
      { name: "Órdenes de Venta", link: "/ventas/ordenesVenta" }
    ]
  },
  components: {
    FormGroup,
    Datepicker,
    ProductListDialog
  },
  async fetch({ store }) {
    //await store.dispatch('saleOrders/addOrder/fetchProducts');
    await store.dispatch("saleOrders/addOrder/fetchSaleStatuses");
    await store.dispatch("saleOrders/addOrder/fetchClients");
    await store.dispatch("saleOrders/addOrder/fetchUsers");
  },
  data() {
    return {
      productDialog: false,
      saleOrder: {},
      saleOrderItems: [],
      detailHeaders: [
        { sortable: false, key: "name", text: "Producto" },
        { sortable: false, key: "unitPrice", text: "Precio unitario" },
        { sortable: false, key: "quantity", text: "Cantidad" },
        { sortable: false, key: "salePrice", text: "Precio de compra" },
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
        this.saleOrderItems,
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
      return "Nueva orden de venta";
    },
    clientAutocompleteHint() {
      const { name } = this.saleOrder.client || {};
      return name ? name : "";
    },
    ...mapState("saleOrders/addOrder", [
      "products",
      "page",
      "saleStatuses",
      "clients",
      "users"
    ]),
    saleOrderAmount() {
      let addItemToTotalAmount = (
        totalAmount,
        { quantity, unitPrice, disscount }
      ) => {
        return totalAmount + unitPrice * quantity - disscount;
      };
      return this.saleOrderItems.reduce(addItemToTotalAmount, 0);
    }
  },
  methods: {
    ...mapActions("saleOrders", ["createSaleOrder"]),
    openProductList() {
      this.productDialog = true;
    },
    async saveSaleOrder() {
      if (this.$refs.saleOrderForm.validate()) {
        const saleOrder = this.saleOrder;
        try {
          const { nativeId } = saleOrder;
          const extractDetail = p => ({
            product: {
              id: p.id
            },
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            disscount: p.disscount
          });
          if (this.saleOrderItems) {
            saleOrder.details = this.saleOrderItems.map(extractDetail);
          }
          const res = await this.$confirm(
            `¿Está seguro de guardar la orden de compra '${nativeId}'?`,
            { title: "Advertencia" }
          );
          if (res) {
            await this.createSaleOrder({ saleOrder });
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
        "saleOrders/addOrder/fetchProducts",
        params
      );
    },
    // Añade un producto al detalle
    addProductToDetail(selectProduct) {
      this.saleOrderItems.push({
        ...selectProduct,
        quantity: 1,
        unitPrice: selectProduct.salePrice,
        salePrice: 0,
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
        this.saleOrderItems,
        item => item.id === product.id
      );
      this.$delete(this.saleOrderItems, productIdx);
    }
  }
};
</script>