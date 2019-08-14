import BasePermiter from './base-perimeter'
import menus from '@/util/menus';

export default new BasePermiter({
  purpose: 'menus',
  can: {
    viewPurchase() {
      return this.isPurchaseViewer() || this.isPurchaseOrganizer() || this.isPurchaseRegistrant();
    },    
    viewWarehouse() {
      return this.isWarehouseViewer() || this.isWarehouseOrganizer() || this.isWarehouseRegistrant();
    },
    viewSale() {
      return this.isSaleViewer() || this.isSaleOrganizer() || this.isSaleRegistrant();
    }
  },
  renderMenus(){
    const _this = this;
  
    let checkChildren = (children) => {
      
      const allowedChildren = [];
      
      children.forEach((child) => {
        const checkedChild = checkChild(child);
        if(checkedChild) {
          allowedChildren.push(checkedChild);
        }
      })
  
      return allowedChildren;
    };
  
    let checkChild = (child) => {
      const isAllowed = this.governess.isAllowed(child.perimeterAction)

      if(isAllowed) {
        const checkedChild = Object.assign({}, child);
        
        if(checkedChild && checkedChild.children) {
          checkedChild.children = checkChildren(child.children);
        }
  
        checkedChild.isAllowed = isAllowed;
        
        return checkedChild;
      }
    }
    // return menus;
    return checkChildren(menus);
  },
  expose: [
    'renderMenus'
  ]
});

