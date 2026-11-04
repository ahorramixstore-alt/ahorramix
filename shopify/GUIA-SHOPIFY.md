# Ahorramix en Shopify · Guía paso a paso

## Qué contiene `/export/shopify/`

| Archivo | Para qué sirve |
|---|---|
| `ahorramix-tema-shopify.zip` | El tema (Online Store 2.0) con el diseño de Ahorramix. Se sube en **Tienda online › Temas › Añadir tema › Subir archivo ZIP**. |
| `video-portada/` | El vídeo de la portada (escritorio y móvil). Shopify no admite vídeos dentro del tema, así que se suben a **Contenido › Archivos**. |
| `colecciones-ahorramix.csv` | Lista de las 11 categorías originales, sus subcategorías y las colecciones especiales, con el **handle** exacto que usa el tema. |
| `Custom Collections (Matrixify).csv` | Las mismas colecciones, para crearlas de una vez con la app Matrixify (opcional; su plan gratuito importa como máximo 10). |
| `plantilla-productos-shopify.csv` | Cabeceras oficiales del CSV de productos de Shopify, por si algún día subes productos a mano. No hace falta: tu app de dropshipping los sincroniza. |
| `paginas/` | Textos de las páginas: aviso legal, privacidad, cookies, condiciones, envíos, devoluciones, sobre nosotros, contacto y preguntas frecuentes. |
| `../ahorramix-proyecto-completo.zip` | Copia de todo el proyecto (tienda React, plugin de WordPress, tema de Shopify y documentación). |

**Por qué estructura completa sin productos:** el tema reproduce la portada, la cabecera, el menú, las fichas, el carrito, el pie y las páginas. Los productos de la tienda actual eran de ejemplo, así que no se exportan. Tu app de dropshipping subirá los reales y el tema los mostrará solos en cuanto estén en sus colecciones.

## Paso 1 · Subir el tema (5 min)

1. Shopify › **Tienda online › Temas** › **Añadir tema** › **Subir archivo ZIP** › elige `ahorramix-tema-shopify.zip`.
2. Cuando termine, pulsa **Personalizar** para verlo. No lo publiques todavía.

## Paso 2 · Crear las colecciones con estos nombres (15 min)

Shopify no tiene importación oficial de colecciones por CSV. Créalas en **Productos › Colecciones › Crear colección**, con el **título exacto** de la tabla. Shopify genera el handle automáticamente a partir del título. Compruébalo en «Ficha del buscador» y corrígelo si no coincide.

| Título | Handle | Tipo |
|---|---|---|
| Hogar y cocina | `hogar-y-cocina` | Manual |
| Electrónica | `electronica` | Manual |
| Informática y oficina | `informatica-y-oficina` | Manual |
| Moda | `moda` | Manual |
| Belleza y bienestar | `belleza-y-bienestar` | Manual |
| Deportes y aire libre | `deportes-y-aire-libre` | Manual |
| Mascotas | `mascotas` | Manual |
| Bebé e infantil | `bebe-e-infantil` | Manual |
| Jardín y bricolaje | `jardin-y-bricolaje` | Manual |
| Coche y moto | `coche-y-moto` | Manual |
| Viaje y equipaje | `viaje-y-equipaje` | Manual |
| Ofertas | `ofertas` | Automática: «Precio de comparación» › es mayor que › 0 |
| Ofertas del día | `ofertas-del-dia` | Automática: Etiqueta › es igual a › `oferta-del-dia` |
| Destacados | `destacados` | Automática: Etiqueta › es igual a › `destacado` |
| Más vendidos | `mas-vendidos` | Automática: Etiqueta › es igual a › `mas-vendido` |
| Novedades | `novedades` | Automática: Etiqueta › es igual a › `novedad` |

Las subcategorías (Decoración, Audio, Calzado…) están en `colecciones-ahorramix.csv`. Son opcionales. Si las creas, el menú «Todas las categorías» las mostrará debajo de su departamento. El carrusel de la portada enlaza a `decoracion`, `audio` y `moda`: si no creas Decoración y Audio, cambia esos enlaces en el personalizador.

**Si ya tienes colecciones creadas** con otros nombres, no hace falta renombrarlas. En el personalizador, cada bloque de categoría y cada fila de productos tiene un selector «Colección»: elige la tuya y el tema dejará de usar el handle.

**App de dropshipping (DSers, AutoDS, Zendrop…):** al importar cada producto, asígnalo a su colección y añade las etiquetas (`destacado`, `mas-vendido`, `novedad`, `oferta-del-dia`) para que aparezca en las secciones de la portada. Pon «Precio de comparación» para que se muestre el descuento.

## Paso 3 · Menús (10 min)

En **Tienda online › Navegación** (o **Contenido › Menús**):

1. **Menú principal** (`main-menu`), el que usa la cabecera: añade los 11 departamentos enlazando a su colección. Para las subcategorías, arrastra cada elemento debajo de su departamento. Así aparecen en «Todas las categorías» y en el menú del móvil.
2. Crea **tres menús nuevos** para el pie, con estos identificadores:
   - `footer-tienda` («Tienda»): Todos los productos (`/collections/all`), los departamentos principales y Ofertas.
   - `footer-ayuda` («Ayuda»): Preguntas frecuentes, Envíos, Devoluciones y reembolsos, Contacto, Sobre nosotros y Mi cuenta.
   - `footer-legal` («Legal»): Aviso legal, Política de privacidad, Política de cookies y Condiciones de venta.
3. Si los identificadores salen distintos, elígelos en **Personalizar › Pie de página › Columna de enlaces**.

## Paso 4 · Páginas y políticas (15 min)

1. **Ajustes › Políticas**: pega en cada política el texto de `paginas/` (`devoluciones.html` › Reembolsos, `privacidad.html` › Privacidad, `condiciones.html` › Términos del servicio, `envios.html` › Envío, `aviso-legal.html` › Aviso legal). Usa el botón `<>` del editor para pegar HTML.
2. **Tienda online › Páginas › Añadir página**:
   - «Sobre nosotros», plantilla **page.about**, texto de `sobre-nosotros.html`.
   - «Contacto», plantilla **page.contact**.
   - «Preguntas frecuentes», plantilla **page.faq**, con el handle `preguntas-frecuentes`.
   - «Política de cookies», plantilla **page**, texto de `cookies.html`.
3. Sustituye en los textos legales todo lo que está entre **[corchetes]** (dirección, email, teléfono…). Son plantillas orientativas: revísalas con un profesional.

## Paso 5 · Personalizar sin código

En **Personalizar**:
- **Cabecera › Logo**: el logo de Ahorramix ya viene incluido. Para usar otro, súbelo aquí (PNG transparente). Lo mismo en **Pie de página › Logo**.
- **Portada con vídeo › Vídeo de fondo**: sube `video-portada/hero-ofertas.mp4` (en Contenido › Archivos o desde el propio selector) y elígelo. Mientras tanto se ve la imagen de portada.
- **Barra de avisos**, **Carrusel de ofertas** (banners y tarjetas), **Ventajas**, **Ofertas del día** (con la fecha de fin para la cuenta atrás), **Pestañas** y **Franja de lemas**: todos los textos, enlaces, colores e imágenes se cambian desde ahí. Puedes añadir, quitar y reordenar secciones.
- **Configuración del tema**: colores de marca, fuentes, favicon, imagen al compartir, redes sociales, datos del vendedor (nombre, NIF, dirección y email del pie) y texto de plazo de entrega.

## Paso 6 · Pagos, envíos e impuestos (lo configuras tú)

El tema usa el carrito y el checkout nativos de Shopify. No hay ninguna pasarela propia.
- **Ajustes › Pagos**: activa Shopify Payments, PayPal, Bizum (vía proveedor compatible), etc.
- **Ajustes › Envío y entrega**: tarifas y zonas.
- **Ajustes › Impuestos y aranceles**: España, con «Incluir impuestos en los precios» activado (el tema dice «IVA incluido»).
- **Ajustes › Cuentas de cliente**: elige **«Cuentas de cliente» (nuevas, sin contraseña)**, que es la opción recomendada por Shopify. El tema enlaza a ellas desde el icono «Cuenta». Las cuentas clásicas necesitarían plantillas adicionales que este tema no incluye.
- **Ajustes › Idiomas**: español como idioma predeterminado.

## Paso 7 · Comprobar antes de publicar

1. En **Personalizar**, revisa la portada en escritorio y móvil (icono de móvil arriba).
2. Abre una colección, un producto, añade al carrito y pulsa **Finalizar compra**: debe abrirse el checkout de Shopify.
3. Haz un pedido de prueba (Ajustes › Pagos › modo de prueba, o «Pasarela de pago falsa»).
4. Comprueba el menú «Todas las categorías», el buscador, el pie y las páginas legales.
5. **Tienda online › Temas › Ahorramix › Publicar**.

## SEO incluido

Título y meta descripción de cada página (los editas en «Ficha del buscador» de cada producto, colección o página). También:
- etiquetas Open Graph y Twitter para compartir;
- datos estructurados de producto (precio y disponibilidad);
- URL canónica;
- texto alternativo de imágenes (usa el «Texto alternativo» de cada imagen en Shopify).

## Lista de tareas manuales

- [ ] Subir el tema
- [ ] Crear las 11 colecciones y las 5 especiales
- [ ] Crear los menús `main-menu`, `footer-tienda`, `footer-ayuda` y `footer-legal`
- [ ] Políticas y páginas, con los [corchetes] sustituidos
- [ ] Subir y elegir el vídeo de portada
- [ ] Datos del vendedor (Configuración del tema › Datos del vendedor)
- [ ] Pagos, envíos e impuestos
- [ ] Conectar la app de dropshipping y asignar colecciones y etiquetas
- [ ] Pedido de prueba y publicar el tema

## Limitaciones honestas

- El tema se ha validado con la herramienta oficial **Shopify Theme Check**, pero no se ha probado dentro de una tienda Shopify real (requiere tu cuenta). Revisa el paso 7.
- No incluye el «Evaluador de productos» ni el inicio de sesión con Google de la versión React. Shopify gestiona las cuentas de cliente de forma nativa.
- Las fuentes Cabinet Grotesk y Satoshi se cargan desde Fontshare (gratis). Puedes desactivarlas en Configuración del tema › Tipografía.
