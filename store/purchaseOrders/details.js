import { 
    SET_SALE_ORDER,
    SET_PRODUCTS,
  } from '@/util/mutations-types'
  export const state = () => ({
    saleOrder: {},
    products: [],
  });
  
  export const mutations = {
    [SET_SALE_ORDER](state, saleOrder){
      state.saleOrder = saleOrder;
    },
    [SET_PRODUCTS](state, products){
      state.products = products;
    },
  }
  
  export const actions = {
    async fetchSaleOrder({commit}, { saleOrderId }) {
      const saleOrder = await this.$saleOrders.getSaleOrderById(saleOrderId);
      commit(SET_SALE_ORDER, saleOrder);
      return saleOrder;
    },
    async fetchProducts({commit}) {
      const products = await this.$products.listProducts();
      commit(SET_PRODUCTS, products);
    },
    async createSaleDetail({ state, dispatch }, { saleDetail }) {
    
      await this.$saleDetails.createSaleDetail({
        ...saleDetail,
        sale: state.saleOrder
      });
      await dispatch('fetchSaleOrder', { saleOrderId: this.$_.get(state, 'saleOrder.id', { })});
    },
    async updateSaleDetail({ state, dispatch }, { saleDetail }) {
      
      await this.$saleDetails.updateSaleDetail({
        ...saleDetail,
        sale: state.saleOrder
      });
      await dispatch('fetchSaleOrder', { saleOrderId: this.$_.get(state, 'saleOrder.id', { })});
    },
    async deleteSaleDetail({ state, dispatch }, { saleDetail }) {
      
      await this.$saleDetails.deleteSaleDetail({
        ...saleDetail,
        sale: state.saleOrder
      });
      await dispatch('fetchSaleOrder', { saleOrderId: this.$_.get(state, 'saleOrder.id', { })});
    },
    async createSaleInvoice({ state, dispatch }, { saleInvoice }) {
    
      await this.$saleInvoices.createSaleInvoice({
        ...saleInvoice,
        sale: state.saleOrder
      });
      await dispatch('fetchSaleOrder', { saleOrderId: this.$_.get(state, 'saleOrder.id', { })});
    },
    async updateSaleInvoice({ state, dispatch }, { saleInvoice }) {
      
      await this.$saleInvoices.updateSaleInvoice({
        ...saleInvoice,
        sale: state.saleOrder
      });
      await dispatch('fetchSaleOrder', { saleOrderId: this.$_.get(state, 'saleOrder.id', { })});
    },
    async deleteSaleInvoice({ state, dispatch }, { saleInvoice }) {
      
      await this.$saleInvoices.deleteSaleInvoice({
        ...saleInvoice,
        sale: state.saleOrder
      });
      await dispatch('fetchSaleOrder', { saleOrderId: this.$_.get(state, 'saleOrder.id', { })});
    },
  }