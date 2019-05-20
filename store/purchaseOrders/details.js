import { 
    SET_PURCHASE_ORDER,
    SET_RECEPTION_STATUSES
  } from '@/util/mutations-types'
  export const state = () => ({
    purchaseOrder: {},
    receptionStatuses: []
  });
  
  export const mutations = {
    [SET_PURCHASE_ORDER](state, purchaseOrder){
      state.purchaseOrder = purchaseOrder;
    },
    [SET_RECEPTION_STATUSES](state, receptionStatus){
      state.receptionStatus = receptionStatus;
    }
  }
  
  export const actions = {
    async fetchPurchaseOrder({commit}, { purchaseOrderId }) {
      const purchaseOrder = await this.$purchaseOrders.getPurchaseOrderById(purchaseOrderId);
      commit(SET_PURCHASE_ORDER, purchaseOrder);
      return purchaseOrder;
    },
    async createPurchaseDetail({ state, dispatch }, { purchaseDetail }) {
    
      await this.$purchaseDetails.createPurchaseDetail({
        ...purchaseDetail,
        purchaseOrder: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchase.id', { })});
    },
    async updatePurchaseDetail({ state, dispatch }, { purchaseDetail }) {
      
      await this.$purchaseDetails.updatePurchaseDetail(purchaseDetail.id, {
        ...purchaseDetail,
        purchaseOrder: state.purchaseOrder
      });
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchase.id', { })});
    },
    async deletePurchaseDetail({ state, dispatch }, { purchaseDetail }) {
      
      await this.$purchaseDetails.deletePurchaseDetail(purchaseDetail);
      await dispatch('fetchPurchaseOrder', { purchaseOrderId: this.$_.get(state, 'purchase.id', { })});
    },
    async fetchReceptionStatuses({commit}) {
      const receptionStatuses = await this.$purchaseDetails.listReceptionStatuses();
      commit(SET_RECEPTION_STATUSES, receptionStatuses);
    },
  }