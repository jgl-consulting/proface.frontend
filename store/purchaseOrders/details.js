import { 
    SET_PURCHASE_ORDER,
    SET_PRODUCTS,
    SET_RECEPTION_STATUSES
  } from '@/util/mutations-types'
  export const state = () => ({
    purchaseOrder: {},
    products: [],
    receptionStatuses: []
  });
  
  export const mutations = {
    [SET_PURCHASE_ORDER](state, purchaseOrder){
      state.purchaseOrder = purchaseOrder;
    },
    [SET_RECEPTION_STATUSES](state, receptionStatuses){
      state.receptionStatuses = receptionStatuses;
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
      const products = await this.$purchaseDetails.listProducts();
      commit(SET_PRODUCTS, products);
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
      const receptionStatuses = await this.$purchaseDetails.listReceptionStatuses();
      commit(SET_RECEPTION_STATUSES, receptionStatuses);
    },
  }