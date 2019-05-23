export default [
  {
    id: 'bancos',
    title: 'Bancos',
    icon: 'fa fa-piggy-bank',
    to: '/bancos',
    description: 'Gestión de bancos de la compañía',
    allowedRoles: ['COMPRAS']
  },
  {
    id: 'proveedores',
    title: 'Proveedores',
    icon: 'fa fa-truck',
    to: '/proveedores',
    description: 'Gestión de proveedores de la compañía',
    allowedRoles: ['COMPRAS'],
  },
  {
    id: 'lineasProducto',
    title: 'Líneas de Producto',
    icon: 'fa fa-tags',
    to: '/lineasProducto',
    description: 'Gestión de líneas de producto de la compañía',
    allowedRoles: ['COMPRAS']
  },
  {
    id: 'productos',
    title: 'Productos',
    icon: 'fa fa-boxes',
    to: '/productos',
    description: 'Gestión de productos de la compañía',
    allowedRoles: ['COMPRAS'],
  },
  {
    id: 'ordenesCompra',
    title: 'Órdenes de Compra',
    icon: 'fa fa-shopping-bag',
    to: '/ordenesCompra',
    description: 'Gestión de órdenes de compra de la compañía',
    allowedRoles: ['COMPRAS']
  },
]