import BasePermiter from './base-perimeter'

export default new BasePermiter({
  purpose: 'sale_order',
  can: {
    route: () => true,
    createSaleOrder() {
      return this.isSaleAdmin();
    },
    listSaleOrder: () => true
  }
});