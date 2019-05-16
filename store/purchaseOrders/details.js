import { 
    SET_PURCHASE_ORDER
  } from '@/util/mutations-types'
  export const state = () => ({
    purchaseOrder: {}
  });
  
  export const mutations = {
    [SET_PURCHASE_ORDER](state, purchaseOrder){
      state.purchaseOrder = purchaseOrder;
    }
  }
  
  export const actions = {
    async fetchPurchaseOrder({commit}, { purchaseOrderId }) {
      const purchaseOrder = await this.$purchaseOrders.getPurchaseOrderById(purchaseOrderId);
      commit(SET_PURCHASE_ORDER, purchaseOrder);
      return purchaseOrder;
    }
  }