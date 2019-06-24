import BasePermiter from './base-perimeter'

export default new BasePermiter({
  purpose: 'purchase',
  can: {
    viewPurchase() {
      return this.isPurchaseViewer() || this.isPurchaseOrganizer() || this.isPurchaseRegistrant();
    },
    organizePurchase() {
      return this.isPurchaseOrganizer();
    },
    registerPurchase() {
      return this.isPurchaseRegistrant()|| this.isPurchaseOrganizer();
    }
  }
});