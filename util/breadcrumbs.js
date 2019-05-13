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
}