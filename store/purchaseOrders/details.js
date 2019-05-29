import { 
    SET_PURCHASE_ORDER,
    SET_PRODUCTS,
    SET_CURRENCIES,
    SET_RECEPTION_STATUSES
  } from '@/util/mutations-types'
  export const state = () => ({
    purchaseOrder: {},
    products: [],
    currencies: [],
    receptionStatuses: []
  });
  
  export const mutations = {
    [SET_PURCHASE_ORDER](state, purchaseOrder){
      state.purchaseOrder = purchaseOrder;
    },
    [SET_RECEPTION_STATUSES](state, receptionStatuses){
      state.receptionStatuses = receptionStatuses;
    },
    [SET_CURRENCIES](state, currencies){
      state.currencies = currencies;
    },
    [SET_PRODUCTS](state, products){
      state.products = products;
    }
  }
  
  export const actions = {
    async fetchPurchaseOrder({commit}, { purchaseOrderId }) {
      const purchaseOrder = await this.$purchaseOrders.getPurchaseOrderById(purchaseOrderId);
      commit(SET_PURCHASE_ORDER, purchaseOrder);
      return purchaseOrder;
    },
    async fetchProducts({commit}) {
      const products = await this.$products.listProducts();
      commit(SET_PRODUCTS, products);
    },
    async fetchCurrencies({commit}) {
      const currencies = await this.$currencies.listCurrencies();
      commit(SET_CURRENCIES, currencies);
    },
    async createPurchaseDetail({ state, dispatch }, { purchaseDetail }) {
    
      await this.$purchaseDetails.createPurchaseDetail({
        ...purchaseDetail,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async updatePurchaseDetail({ state, dispatch }, { purchaseDetail }) {
      
      await this.$purchaseDetails.updatePurchaseDetail({
        ...purchaseDetail,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async deletePurchaseDetail({ state, dispatch }, { purchaseDetail }) {
      
      await this.$purchaseDetails.deletePurchaseDetail({
        ...purchaseDetail,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async fetchReceptionStatuses({commit}) {
      const receptionStatuses = await this.$receptionStatuses.listReceptionStatuses();
      commit(SET_RECEPTION_STATUSES, receptionStatuses);
    },
    async createPurchaseCost({ state, dispatch }, { purchaseCost }) {
    
      await this.$purchaseCosts.createPurchaseCost({
        ...purchaseCost,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async updatePurchaseCost({ state, dispatch }, { purchaseCost }) {
      
      await this.$purchaseCosts.updatePurchaseCost({
        ...purchaseCost,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async deletePurchaseCost({ state, dispatch }, { purchaseCost }) {
      
      await this.$purchaseCosts.deletePurchaseCost({
        ...purchaseCost,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async createPurchaseInvoice({ state, dispatch }, { purchaseInvoice }) {
    
      await this.$purchaseInvoices.createPurchaseInvoice({
        ...purchaseInvoice,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async updatePurchaseInvoice({ state, dispatch }, { purchaseInvoice }) {
      
      await this.$purchaseInvoices.updatePurchaseInvoice({
        ...purchaseInvoice,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
    async deletePurchaseInvoice({ state, dispatch }, { purchaseInvoice }) {
      
      await this.$purchaseInvoices.deletePurchaseInvoice({
        ...purchaseInvoice,
        purchase: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchaseOrder.id', { })});
    },
  }