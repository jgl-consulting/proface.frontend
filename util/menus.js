export default [
 {
    id: 'compras',
    title: 'Compras',
    icon: 'fa fa-piggy-bank',
    description: 'Módulo de compras',
    allowedRoles: ['COMPRAS'],
    children: [
      {
        id: 'bancos',
        title: 'Bancos',
        icon: 'fa fa-piggy-bank',
        to: '/compras/bancos',
        description: 'Gestión de bancos de la compañía',
        allowedRoles: ['COMPRAS']
      },
      {
        id: 'estadosCompra',
        title: 'Estados de Compra',
        icon: 'fa fa-project-diagram',
        to: '/compras/estadosCompra',
        description: 'Gestión de estados de compra de la compañía',
        allowedRoles: ['COMPRAS']
      },
      {
        id: 'estadosRecepcion',
        title: 'Estados de Recepción',
        icon: 'fa fa-exclamation-circle',
        to: '/compras/estadosRecepcion',
        description: 'Gestión de estados de recepción de la compañía',
        allowedRoles: ['COMPRAS']
      },
      {
        id: 'lineasProducto',
        title: 'Líneas de Producto',
        icon: 'fa fa-tags',
        to: '/compras/lineasProducto',
        description: 'Gestión de líneas de producto de la compañía',
        allowedRoles: ['COMPRAS']
      },
      {
        id: 'ordenesCompra',
        title: 'Órdenes de Compra',
        icon: 'fa fa-shopping-cart',
        to: '/compras/ordenesCompra',
        description: 'Gestión de órdenes de compra de la compañía',
        allowedRoles: ['COMPRAS']
      },
      {
        id: 'productos',
        title: 'Productos',
        icon: 'fa fa-boxes',
        to: '/compras/productos',
        description: 'Gestión de productos de la compañía',
        allowedRoles: ['COMPRAS'],
      },
      {
        id: 'proveedores',
        title: 'Proveedores',
        icon: 'fa fa-truck',
        to: '/compras/proveedores',
        description: 'Gestión de proveedores de la compañía',
        allowedRoles: ['COMPRAS'],
      },
    ]
  }
]