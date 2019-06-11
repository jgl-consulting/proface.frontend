export default [{
    id: 'compras',
    title: 'Compras',
    icon: 'fa fa-shopping-bag',
    description: 'Módulo de Gestión de Compras',
    allowedRoles: ['COMPRAS'],
    children: [{
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
        icon: 'fa fa-question-circle',
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
  },
  {
    id: 'almacen',
    title: 'Almacén',
    icon: 'fa fa-store',
    description: 'Módulo de Gestión de Almacén',
    allowedRoles: ['ALMACEN'],
    children: [{
        id: 'ubicaciones',
        title: 'Ubicaciones',
        icon: 'fa fa-map-marker-alt',
        to: '/almacen/ubicaciones',
        description: 'Gestión de ubicaciones de la compañía',
        allowedRoles: ['ALMACEN']
      },
      {
        id: 'tiposEmpaque',
        title: 'Tipos de Empaque',
        icon: 'fa fa-paperclip',
        to: '/almacen/tiposEmpaque',
        description: 'Gestión de tipos de empaque de la compañía',
        allowedRoles: ['ALMACEN']
      },
      {
        id: 'estadosUnidad',
        title: 'Estados de Unidad',
        icon: 'fa fa-play-circle',
        to: '/almacen/estadosUnidad',
        description: 'Gestión de estados de unidad de la compañía',
        allowedRoles: ['ALMACEN']
      },
      {
        id: 'empaques',
        title: 'Empaques',
        icon: 'fa fa-archive',
        to: '/almacen/empaques',
        description: 'Gestión de empaques de la compañía',
        allowedRoles: ['ALMACEN']
      },
      {
        id: 'unidades',
        title: 'Unidades',
        icon: 'fa fa-parking',
        to: '/almacen/unidades',
        description: 'Gestión de unidades de la compañía',
        allowedRoles: ['ALMACEN']
      },
    ]
  }
]
