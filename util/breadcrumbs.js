export default {
  "index": function() {
    return [
      { 
        text: 'Módulos', 
        href: '/'
      }
    ]
  },
  "proveedores": function (){
    return [
      { 
        text: 'Módulos', 
        href: '/' 
      }, 
      { 
        text: 'Proveedores', 
        href: '/proveedores' 
      },
    ]
  },
  "proveedores-supplierId": function(supplier, path) {
    return [
      { 
        text: 'Módulos', 
        href: '/' 
      }, 
      { 
        text: 'Proveedores', 
        href: '/proveedores'
      },
      {
        text: supplier ? supplier.name : '',
        href: path || ''
      }
    ];
  },
  "productos": function (){
    return [
      { 
        text: 'Módulos', 
        href: '/' 
      }, 
      { 
        text: 'Productos', 
        href: '/productos' 
      },
    ]
  },
  "productos-productId": function(product, path) {
    return [
      { 
        text: 'Módulos', 
        href: '/' 
      }, 
      { 
        text: 'Productos', 
        href: '/productos'
      },
      {
        text: product ? product.name : '',
        href: path || ''
      }
    ];
  },
}