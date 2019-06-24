import BasePermiter from './base-perimeter'

export default new BasePermiter({
  purpose: 'warehouse',
  can: {
    viewWarehouse() {
      return this.isWarehouseViewer() || this.isWarehouseOrganizer() || this.isWarehouseRegistrant();
    },
    organizeWarehouse() {
      return this.isWarehouseOrganizer();
    },
    registerWarehouse() {
      return this.isWarehouseRegistrant()|| this.isWarehouseOrganizer();
    },
    registerBatches() {
      return this.isWarehouseRegistrant()|| this.isWarehouseOrganizer() || this.isPurchaseRegistrant()|| this.isPurchaseOrganizer();
    }
  }
});