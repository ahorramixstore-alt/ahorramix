# 01 · Arquitectura

## Decisión

**Frontend React estático (headless) + WordPress/WooCommerce en Hostinger.**

```
 Visitante
    │
    ▼
 tudominio.es  ──────────────►  Archivos estáticos React (public_html)
    │  lee catálogo (GET, público, sin claves)
    ▼
 tienda.tudominio.es  ───────►  WordPress + WooCommerce (Hostinger)
    │                             · Catálogo, precios, stock, impuestos
    │                             · Checkout, cupones, envío, pagos
    │                             · Pedidos, clientes, correos
    │                             · Plugins de proveedores de dropshipping
    ▼
 Pasarela de pago (Stripe / PayPal / Redsys…)   Proveedores (vía plugin)
```

### Por qué

- El diseño se construye y previsualiza en Emergent, y se exporta como HTML/CSS/JS estático: se sube a cualquier hosting sin servidor Node.
- Todo lo comercial (pagos, pedidos, datos personales, impuestos) vive en WooCommerce, que es mantenido, compatible con Hostinger y tiene plugins para proveedores y pasarelas.
- El frontend **no guarda datos bancarios ni claves**: solo lee la *Store API* pública de WooCommerce y redirige al checkout de WooCommerce para pagar.

## Separación de responsabilidades

| Área | Dónde vive | Archivos |
|---|---|---|
| Diseño visual y componentes | React | `frontend/src/components`, `frontend/src/pages`, `frontend/src/index.css` |
| Catálogo y gestión de productos | WooCommerce (admin de WordPress) | Adaptador: `frontend/src/lib/commerce/woocommerce.js` |
| Carrito | React (navegador, `localStorage`) hasta pulsar «Finalizar compra» | `frontend/src/context/CartContext.jsx` |
| Checkout y pago | WooCommerce + pasarela | `wordpress/ahorramix-bridge` traspasa el carrito |
| Pedidos y clientes | WooCommerce | — |
| Proveedores de dropshipping | Plugins de WooCommerce | `docs/06-INTEGRACIONES-PENDIENTES.md` |
| Selección de productos | Evaluador interno (React, solo en tu navegador) → CSV → importador WooCommerce | `frontend/src/lib/evaluator.js` |
| Configuración y alojamiento | Hostinger | `frontend/public/.htaccess`, variables `.env` |

## Modos de funcionamiento

- `REACT_APP_COMMERCE_MODE=demo`: productos ficticios de `frontend/src/data/demo/`. Checkout desactivado y avisos visibles.
- `REACT_APP_COMMERCE_MODE=woocommerce` + `REACT_APP_WC_STORE_URL`: catálogo real desde WooCommerce, checkout activo vía WooCommerce.

## Limitaciones conocidas (honestas)

- **SEO de una SPA**: Google ejecuta JavaScript, pero otros buscadores y las previsualizaciones sociales pueden ver menos contenido. Si el SEO orgánico es prioritario, valora: (a) prerenderizado de rutas, o (b) la alternativa de usar el tema de WooCommerce para las fichas de producto. Ver `docs/08-MANTENIMIENTO.md`.
- **Dos dominios/subdominios**: el checkout se muestra en el dominio de WordPress. Conviene darle el mismo estilo (colores y logo) desde el editor de temas de WordPress.
- **Sin backend propio**: el formulario de contacto abre el correo del visitante. Para un formulario con envío real usa un plugin de WordPress (ver integraciones pendientes).
- El plugin `ahorramix-bridge` no se ha podido ejecutar en un WordPress real desde Emergent: pruébalo en staging.
