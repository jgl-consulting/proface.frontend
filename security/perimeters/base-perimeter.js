import { Perimeter } from 'vue-kindergarten';
import _ from 'lodash'


export default class BasePerimeter extends Perimeter {
  isPurchaseOrganizer() {
    return this.hasRole('PURCHASE_ORGANIZER');
  }

  isPurchaseViewer() {
    return this.hasRole('PURCHASE_VIEWER');
  }

  isPurchaseRegistrant() {
    return this.hasRole('PURCHASE_REGISTRANT');
  }

  isWarehouseOrganizer() {
    return this.hasRole('WAREHOUSE_ORGANIZER');
  }

  isWarehouseViewer() {
    return this.hasRole('WAREHOUSE_VIEWER');
  }

  isWarehouseRegistrant() {
    return this.hasRole('WAREHOUSE_REGISTRANT');
  }

  hasRole(role) {
    return !!_.find(this.child.roles || [], ['name', role]);
  }
}