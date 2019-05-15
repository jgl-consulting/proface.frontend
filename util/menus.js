export default [
  {
    id: 'proveedores',
    title: 'Gestión de proveedores',
    icon: 'fa fa-truck',
    to: '/proveedores',
    description: 'Todo acerca de los proveedores de la compañia',
    allowedRoles: ['COMPRAS'],
  },
  {
    id: 'productos',
    title: 'Gestión de productos',
    icon: 'fa fa-boxes',
    to: '/productos',
    allowedRoles: ['COMPRAS'],
  }
]