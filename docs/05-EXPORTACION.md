# 05 · Exportación, dependencias y variables de entorno

## Cómo descargar el proyecto desde Emergent

- Opción A: botón **«Save to GitHub»** del chat de Emergent → clona el repositorio en tu ordenador.
- Opción B: **descargar el código** desde la interfaz de Emergent (menú del proyecto).

Lo que necesitas de la descarga: `frontend/`, `wordpress/`, `docs/`, `README.md`. La carpeta `backend/` es la plantilla por defecto de Emergent y **la tienda no la usa**.

## Comprobación de dependencias de Emergent (realizada)

| Elemento | ¿Lo necesita la tienda? | Qué hacer al exportar |
|---|---|---|
| `backend/` (FastAPI + MongoDB) | No. Ninguna llamada desde el frontend | Ignorar / borrar |
| `REACT_APP_BACKEND_URL` en `.env` | No se usa en el código de la tienda | Puedes borrarla |
| `<script src="https://assets.emergent.sh/scripts/emergent-main.js">` y el script previo en `public/index.html` | No (solo vista previa de Emergent) | **Elimínalos** antes de `yarn build` (están marcados con `EMERGENT-ONLY`) |
| `@emergentbase/overlay`, `@emergentbase/visual-edits` (devDependencies) | No | Opcional: `yarn remove @emergentbase/overlay @emergentbase/visual-edits`. `craco.config.js` funciona sin ellos |
| `frontend/plugins/health-check` | No (desactivado por defecto) | Puede quedarse |
| Fuentes (Fontshare y Google Fonts) | CDN externos públicos | Opcional: autoalojarlas (ver licencias) |
| Imágenes | Copiadas en `frontend/public/images` | Se suben con el build |

Se ha verificado que `yarn build` genera la versión estática sin errores.

## Variables de entorno (sin credenciales)

Archivo `frontend/.env` (plantilla en `frontend/.env.example`). **Ninguna es secreta**: se incrustan en el JavaScript público, así que nunca pongas claves aquí.

| Variable | Ejemplo | Para qué |
|---|---|---|
| `REACT_APP_COMMERCE_MODE` | `demo` / `woocommerce` | Origen del catálogo |
| `REACT_APP_WC_STORE_URL` | `https://tienda.tudominio.es` | URL de WordPress con WooCommerce |
| `REACT_APP_SITE_URL` | `https://tudominio.es` | URLs canónicas y datos estructurados |
| `REACT_APP_SHOW_EVALUATOR` | `false` en producción | Incluye o no la ruta `/evaluador` |

Variables de WordPress (`wp-config.php`): `AHORRAMIX_FRONTEND_ORIGINS`. Las claves de pasarelas y proveedores se configuran **dentro de WordPress** en cada plugin.
