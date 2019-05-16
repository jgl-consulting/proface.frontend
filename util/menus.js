export default [
  {
    id: 'proveedores',
    title: 'Gestión de proveedores',
    icon: 'fa fa-truck',
    to: '/proveedores',
    description: 'Todo acerca de los proveedores de la compañía',
    allowedRoles: ['COMPRAS'],
  },
  {
    id: 'productos',
    title: 'Gestión de productos',
    icon: 'fa fa-boxes',
    to: '/productos',
    description: 'Todo acerca de los productos de la compañía',
    allowedRoles: ['COMPRAS'],
  },
  {
    id: 'ordenesCompra',
    title: 'Gestión de Compras',
    icon: 'fa fa-shopping-bag',
    to: '/ordenesCompra',
    description: 'Todo acerca de las órdenes de compra de la compañía',
    allowedRoles: ['COMPRAS']
  }
]