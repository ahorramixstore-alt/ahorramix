# 04 · Migración a Hostinger

> Requiere un plan de Hostinger con soporte para WordPress (hosting web/business o superior) y tu dominio.

## Topología recomendada

| Dominio | Contenido |
|---|---|
| `tudominio.es` (`public_html`) | Tienda React compilada |
| `tienda.tudominio.es` | WordPress + WooCommerce (checkout, cuenta, admin) |

Alternativa: WordPress en `tudominio.es` y React en un subdominio (`www` no recomendado). Elige una y no cambies después las URLs para no perder SEO.

## Pasos

1. **Dominio y SSL**: hPanel › Dominios › conecta el dominio. hPanel › Seguridad › SSL › activa SSL en el dominio y en el subdominio.
2. **Subdominio**: hPanel › Dominios › Subdominios › crea `tienda`.
3. **WordPress**: hPanel › Sitio web › Instalador automático › WordPress en `tienda.tudominio.es`. Instala WooCommerce y sigue `docs/03-WOOCOMMERCE.md`.
4. **Plugin puente**: comprime `wordpress/ahorramix-bridge` en zip › Plugins › Añadir nuevo › Subir › Activar. Añade `AHORRAMIX_FRONTEND_ORIGINS` en `wp-config.php` (hPanel › Administrador de archivos).
5. **Compilar el frontend** en tu ordenador:
   ```bash
   cd frontend
   # .env con REACT_APP_COMMERCE_MODE=woocommerce, REACT_APP_WC_STORE_URL, REACT_APP_SITE_URL, REACT_APP_SHOW_EVALUATOR=false
   yarn install && yarn build
   ```
6. **Subir**: hPanel › Administrador de archivos › `public_html` del dominio principal › sube el **contenido** de `frontend/build/` (incluye `.htaccess`, que activa HTTPS y las rutas limpias). Activa «mostrar archivos ocultos» para verlo.
7. **robots.txt y sitemap**: edita `robots.txt` con tu dominio. Genera el sitemap (ver `08-MANTENIMIENTO.md`).
8. **Prueba completa**: `docs/07-PRUEBAS.md`.

## Ajustes manuales obligatorios en Hostinger / WordPress

- Datos del vendedor en `frontend/src/config/store.js` y textos legales en `frontend/src/data/legal.js` (revisados por un profesional).
- Pasarela de pago, zonas y tarifas de envío, impuestos, correos de WooCommerce.
- Plugin(s) de proveedores y sus credenciales (en WordPress, nunca en el frontend).
- Copias de seguridad (hPanel › Copias de seguridad) y actualizaciones automáticas.
- Correo profesional (hPanel › Correos) para `[email@tudominio.es]`.
