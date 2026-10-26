# 07 · Pruebas de carrito, checkout y pedidos

## A. En la vista previa (modo demo)

1. Inicio: categorías, destacados, pestañas Más vendidos / Novedades / Ofertas.
2. Ficha: elige variante, cantidad › «Añadir al carrito» › se abre el panel con el subtotal correcto.
3. `/carrito`: cambiar cantidades, eliminar, vaciar. El botón de pago aparece **desactivado** con aviso.
4. Buscador (`/tienda?q=...`), filtros de categoría, «Solo ofertas», ordenación.
5. `/evaluador`: completa los datos, guarda, selecciona, exporta CSV.

## B. En Hostinger (staging recomendado)

1. Activa el **modo de prueba** de la pasarela (Stripe test / PayPal sandbox).
2. Crea 2 productos de prueba: uno simple y uno variable con 2 variaciones.
3. Comprueba `https://tienda.tudominio.es/wp-json/wc/store/v1/products` (JSON) y que la tienda React los muestra.
4. En DevTools › Red, verifica que la petición desde `tudominio.es` no da error CORS (si falla, revisa `AHORRAMIX_FRONTEND_ORIGINS`).
5. Añade ambos productos (elige variación) › «Finalizar compra» › debe abrir el checkout de WooCommerce con los mismos productos y cantidades.
6. Aplica un cupón de prueba, revisa envío e IVA, paga con tarjeta de prueba.
7. Comprueba: pedido en WooCommerce › Pedidos (estado «Procesando»), correo al cliente y al administrador, pedido visible en «Mi cuenta».
8. Cambia el estado a «Completado» y añade seguimiento › comprueba el correo.
9. Haz un reembolso de prueba desde el pedido.
10. Desactiva el modo de prueba solo cuando todo funcione.

## Checklist antes de abrir al público

- [ ] Datos reales del vendedor en `config/store.js`
- [ ] Textos legales revisados por un profesional
- [ ] Productos de ejemplo eliminados (modo `woocommerce`)
- [ ] `REACT_APP_SHOW_EVALUATOR=false`
- [ ] Scripts `EMERGENT-ONLY` eliminados de `index.html`
- [ ] SSL activo en ambos dominios
- [ ] Copias de seguridad automáticas
