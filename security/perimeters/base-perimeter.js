import { Perimeter } from 'vue-kindergarten';
import _ from 'lodash'
export default class BasePerimeter extends Perimeter {
  isPurchaseAdmin() {
    const { child } = this;
    return _.find(child.roles || [], ['name', 'ADMIN_COMPRAS']) != undefined;
  }
  isSaleAdmin() {
    const { child } = this;
    return _.find(child.roles || [], ['name', 'ADMIN_VENTAS']) != undefined;
  }
}