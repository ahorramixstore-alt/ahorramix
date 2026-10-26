# 04 · Migración a Hostinger

**La guía paso a paso está en [`export/LEEME.md`](../export/LEEME.md).** Allí se usan los paquetes ya generados: no hace falta instalar Node ni compilar.

## Topología

| Dominio | Contenido |
|---|---|
| `tudominio.es` (`public_html`) | Tienda React (contenido de `ahorramix-tienda-hostinger.zip`) |
| `tienda.tudominio.es` | WordPress + WooCommerce + plugin `ahorramix-bridge` (checkout, cuenta, administración) |

Elige la topología una vez y no cambies después las URLs, para no perder posicionamiento.

## Ajustes sin recompilar

`public_html/ahorramix-config.js` controla el modo (`demo` / `woocommerce`), la URL de WooCommerce y la URL pública. Es un archivo público: nunca pongas claves en él.

## Regenerar los paquetes

```bash
cd frontend
yarn install
yarn export:hostinger   # crea export/ahorramix-tienda-hostinger.zip y export/ahorramix-bridge.zip
```

El proceso compila sin el evaluador interno, elimina los scripts de vista previa de Emergent y, si `REACT_APP_SITE_URL` y WooCommerce están configurados en `.env`, genera también un `sitemap.xml` estático. El sitemap dinámico del plugin (`/?ahorramix_sitemap=1`) es la opción recomendada porque se actualiza solo.

## Tareas manuales obligatorias (solo puedes hacerlas tú)

- Dirección, email y teléfono del vendedor en `frontend/src/config/store.js`. Si el NIF/NIE es de persona física, añade nombre y apellidos del titular.
- Revisión profesional de los textos legales (`frontend/src/data/legal.js`).
- Pasarela de pago, zonas y tarifas de envío, impuestos, correos de WooCommerce.
- Plugin(s) de proveedores y sus credenciales (en WordPress, nunca en el frontend).
- Sustituir productos y fotos de ejemplo por los reales.
- Copias de seguridad y actualizaciones automáticas en hPanel.
- Correo profesional (hPanel › Correos).
