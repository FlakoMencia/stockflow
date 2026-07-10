# Inventory App

## Descripción
`inventory-app` es la aplicación SPA desarrollada con Angular para consumir la API de StockFlow y ofrecer una experiencia de usuario enfocada en consulta, gestión y monitoreo del inventario.

## Arquitectura Angular

La aplicación fue construida con una estructura modular por carpetas, componentes standalone y rutas lazy-loaded para mantener el arranque liviano y una base mantenible.

## Standalone Components

La interfaz se implementa sin `AppModule`. Toda la aplicación se monta con `bootstrapApplication`, configuración de router standalone y proveedores globales para HTTP y estado.

## Rutas lazy-loaded

- `/dashboard`
- `/products`
- `/alerts`
- `/movements`

La ruta raíz redirige a `/dashboard`.

## InventoryStore con Signals

El estado global se administra con Angular Signals:

- `signal()` para el estado mutable.
- `computed()` para métricas derivadas.
- `effect()` para persistencia local y notificaciones reactivas.

El store centraliza:

- lista de productos
- alertas activas
- producto seleccionado
- estado de carga
- error activo
- filtro de categoría

## Vistas principales

### Dashboard
Muestra indicadores clave de inventario y estadísticas avanzadas cargadas de forma diferida.

### Products
Presenta el catálogo de productos, filtros por categoría, paginación y visualización de historial por producto.

### Alerts
Lista las alertas activas de stock con énfasis visual en severidad baja o crítica.

### Movements
Permite registrar movimientos de inventario mediante formulario reactivo.

## Uso de `@defer`

Se utilizan bloques diferidos para mejorar la experiencia de carga:

- **Historial de movimientos**: carga con `@defer (on interaction)` cuando el usuario solicita ver el historial de un producto.
- **Estadísticas avanzadas**: carga con `@defer (on viewport)` cuando la sección entra en pantalla.

Cada bloque incluye estados de placeholder, loading y error.

## Sistema de notificaciones

Se implementó un sistema global de toasts sin librerías externas para mostrar mensajes de éxito, advertencia, información y error.

## Interceptor HTTP

El interceptor HTTP centraliza el manejo de errores del backend, interpreta la respuesta estándar de error y muestra mensajes mediante toast. También contempla el caso en que el backend no esté disponible.

## Manejo de backend no disponible

Cuando el servicio backend no responde, la aplicación muestra un mensaje claro de indisponibilidad y mantiene el flujo visual sin romper la interfaz.

## Pruebas unitarias

La base de pruebas frontend utiliza:

- Jasmine
- Karma

La cobertura se genera con el runner de Angular y los reportes de Karma.

## Instalación y ejecución

```bash
npm install
npm start
```

O, de forma equivalente:

```bash
ng serve
```

## Autor

Mario Mencía  
StockFlow Technical Assessment