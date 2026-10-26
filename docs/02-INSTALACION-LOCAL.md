# 02 · Instalación y ejecución fuera de Emergent

## Requisitos

- Node.js 20 LTS (probado con v20.20.2)
- Yarn 1.22 (`corepack enable` o `npm i -g yarn`)

## Pasos

```bash
cd frontend
cp .env.example .env        # edita los valores (ver docs/05-EXPORTACION.md)
yarn install
yarn start                  # desarrollo en http://localhost:3000
yarn build                  # genera frontend/build/ para subir a Hostinger
```

Para ver la tienda compilada en local: `npx serve -s build`.

## Dependencias principales (versiones fijadas en `frontend/package.json`)

| Paquete | Versión | Uso |
|---|---|---|
| react / react-dom | 19.0.0 | Interfaz |
| react-router-dom | 7.18.4 | Rutas limpias (`/producto/slug`, `/categoria/slug`) |
| framer-motion | 11.18.0 | Animaciones |
| lenis | 1.3.4 | Desplazamiento suave |
| tailwindcss | 3.4.17 | Estilos |
| @radix-ui/* (shadcn/ui) | varias | Menús, pestañas, acordeones, paneles |
| lucide-react | 0.516.0 | Iconos |
| sonner | 2.0.3 | Notificaciones |
| @craco/craco + react-scripts | 7.1.0 / 5.0.1 | Compilación |

Paquetes **solo de Emergent** (opcionales, ver `05-EXPORTACION.md`): `@emergentbase/overlay`, `@emergentbase/visual-edits` (devDependencies). La configuración `craco.config.js` funciona aunque no estén instalados.

## Estructura de `frontend/src`

```
config/store.js          Nombre, datos del vendedor, envío gratuito, flags
data/demo/               Productos y categorías de EJEMPLO FICTICIOS
data/legal.js            Plantillas legales editables
lib/commerce/            Capa de datos: demo.js | woocommerce.js | index.js
lib/evaluator.js         Cálculo de márgenes, puntuación y CSV WooCommerce
context/CartContext.jsx  Carrito (localStorage)
components/layout|home|shop|evaluator
pages/                   Home, Shop, Product, Cart, Account, Faq, Contact, About, Legal, Evaluator, NotFound
```
