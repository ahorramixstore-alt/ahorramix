# Ahorramix — Tienda de dropshipping (frontend React + WooCommerce)

Proyecto desarrollado en Emergent para **exportarlo y alojarlo en Hostinger**. No depende de bases de datos, APIs ni servicios de Emergent.

> Importante: exportar estos archivos **no** equivale a tener una tienda operativa. Para vender necesitas WordPress + WooCommerce en Hostinger, pasarela de pago, proveedores, textos legales revisados y datos reales del vendedor. Ver `docs/06-INTEGRACIONES-PENDIENTES.md`.

## Qué contiene

| Carpeta | Contenido | ¿Se sube a Hostinger? |
|---|---|---|
| `frontend/` | Tienda React (diseño, catálogo, carrito, páginas legales, evaluador) | Sí, la carpeta `build/` tras compilar |
| `wordpress/ahorramix-bridge/` | Plugin de WordPress que conecta el frontend con WooCommerce | Sí, como plugin |
| `docs/` | Documentación de arquitectura, migración, pruebas y mantenimiento | No |
| `backend/` | Plantilla FastAPI de Emergent **no utilizada** por la tienda | No |

## Documentación

1. [Arquitectura](docs/01-ARQUITECTURA.md)
2. [Instalación y ejecución fuera de Emergent](docs/02-INSTALACION-LOCAL.md)
3. [Integración con WooCommerce](docs/03-WOOCOMMERCE.md)
4. [Migración a Hostinger](docs/04-HOSTINGER.md)
5. [Exportación, dependencias y variables de entorno](docs/05-EXPORTACION.md)
6. [Integraciones pendientes](docs/06-INTEGRACIONES-PENDIENTES.md)
7. [Pruebas de carrito, checkout y pedidos](docs/07-PRUEBAS.md)
8. [Mantenimiento](docs/08-MANTENIMIENTO.md)
9. [Recursos gráficos y licencias](docs/09-LICENCIAS.md)
