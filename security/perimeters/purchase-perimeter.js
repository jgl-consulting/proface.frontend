import BasePermiter from './base-perimeter'

export default new BasePermiter({
  purpose: 'purchase_order',
  can: {
    route: () => true,
    createPurchaseOrder() {
      return this.isPurchaseAdmin();
    },
    listPurchaseOrder: () => true
  }
});