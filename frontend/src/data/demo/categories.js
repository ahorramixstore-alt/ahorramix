// Estructura de departamentos de EJEMPLO, editable. En producción se lee de WooCommerce › Productos › Categorías.
const dept = (slug, name, icon, image, description, subs) => [
  { slug, name, parent: null, icon, image, description },
  ...subs.map(([s, n]) => ({ slug: s, name: n, parent: slug })),
];

export const DEMO_CATEGORIES = [
  ...dept("hogar", "Hogar y cocina", "Sofa", "/images/vase-aro.jpg", "Decoración, iluminación, textil y cocina.", [["decoracion", "Decoración"], ["iluminacion", "Iluminación"], ["cocina", "Cocina"], ["textil-hogar", "Textil del hogar"], ["organizacion", "Orden y almacenaje"]]),
  ...dept("tecnologia", "Electrónica", "Headphones", "/images/headphones-eco.jpg", "Audio, relojes inteligentes y accesorios.", [["audio", "Audio"], ["relojes-inteligentes", "Relojes inteligentes"], ["accesorios-tecnologia", "Carga y cables"], ["accesorios-movil", "Accesorios para móvil"], ["fotografia", "Fotografía"]]),
  ...dept("informatica-oficina", "Informática y oficina", "Laptop", "", "Accesorios de ordenador y escritorio.", [["accesorios-pc", "Accesorios de PC"], ["escritorio", "Organización de escritorio"], ["papeleria", "Papelería"]]),
  ...dept("moda", "Moda", "Shirt", "/images/sneaker-brisa.jpg", "Calzado, bolsos, gafas y accesorios.", [["bolsos-mochilas", "Bolsos y mochilas"], ["calzado", "Calzado"], ["accesorios", "Gafas y accesorios"], ["joyeria", "Joyería y relojes"]]),
  ...dept("bienestar", "Belleza y bienestar", "Sparkles", "/images/serum-ambar.jpg", "Cuidado personal y bienestar.", [["cuidado-personal", "Cuidado personal"], ["deporte-yoga", "Yoga y relajación"], ["salud", "Salud y masaje"]]),
  ...dept("deportes", "Deportes y aire libre", "Bike", "", "Fitness, camping y ciclismo.", [["fitness", "Fitness"], ["camping", "Camping y senderismo"], ["ciclismo", "Ciclismo"]]),
  ...dept("mascotas", "Mascotas", "PawPrint", "/images/dog-hueso.jpg", "Juguetes, camas y accesorios.", [["juguetes-mascotas", "Juguetes"], ["camas-mascotas", "Camas"], ["comederos", "Comederos y bebederos"]]),
  ...dept("bebe-infantil", "Bebé e infantil", "Baby", "", "Juguetes y puericultura.", [["juguetes", "Juguetes"], ["puericultura", "Puericultura"]]),
  ...dept("jardin-bricolaje", "Jardín y bricolaje", "Flower2", "", "Jardín, terraza y herramientas.", [["jardin", "Jardín y terraza"], ["herramientas", "Herramientas"]]),
  ...dept("coche-moto", "Coche y moto", "Car", "", "Accesorios para el vehículo.", [["accesorios-coche", "Accesorios de coche"], ["limpieza-coche", "Limpieza del coche"]]),
  ...dept("viaje", "Viaje y equipaje", "Luggage", "", "Maletas y accesorios de viaje.", [["maletas", "Maletas"], ["accesorios-viaje", "Accesorios de viaje"]]),
];
