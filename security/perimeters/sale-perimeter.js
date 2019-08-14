import BasePermiter from './base-perimeter'

export default new BasePermiter({
  purpose: 'sale',
  can: {
    viewSale() {
      return this.isSaleViewer() || this.isSaleOrganizer() || this.isSaleRegistrant();
    },
    organizeSale() {
      return this.isSaleOrganizer();
    },
    registerSale() {
      return this.isSaleRegistrant() || this.isSaleOrganizer();
    }
  }
});
