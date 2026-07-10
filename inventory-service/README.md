# Inventory Service

## Descripción
`inventory-service` es el microservicio REST de StockFlow desarrollado con Spring Boot. Expone la lógica principal de inventario, persistencia con H2, documentación OpenAPI, observabilidad con Actuator y tolerancia a fallos con Resilience4j.

## Arquitectura backend

La solución sigue una arquitectura por capas:

- **Controller**: recibe las peticiones HTTP y delega al servicio.
- **Service**: concentra la lógica de negocio.
- **Repository**: accede a la base de datos mediante Spring Data JPA.
- **DTO**: define el contrato de entrada y salida de la API.
- **Exception Handling**: centraliza la respuesta ante errores con un manejador global.

## Modelo de dominio

- **Product**: representa el producto del inventario, su stock, stock mínimo, categoría, SKU y precio.
- **Movement**: registra cada movimiento de inventario y el impacto sobre el stock.
- **StockAlert**: se expone como respuesta derivada cuando un producto llega al umbral mínimo o crítico.

## Endpoints REST

La API se publica bajo el contexto:

```text
/api/v1
```

Endpoints principales:

- `GET /products`
- `GET /products/{id}`
- `POST /movements`
- `GET /alerts`
- `GET /movements/{productId}/history`

La documentación Swagger/OpenAPI está disponible en:

```text
/api/v1/swagger-ui.html
```

## Base de datos H2

El proyecto utiliza H2 en memoria para facilitar la evaluación y la ejecución local. La inicialización automática se realiza con `data.sql`, que carga datos de ejemplo para productos y movimientos al arrancar la aplicación.

## HikariCP

La conexión a base de datos usa HikariCP como pool principal. La configuración fue ajustada para un escenario de carga media:

- `maximum-pool-size: 10`: permite atender concurrencia moderada sin abrir conexiones innecesarias.
- `minimum-idle: 5`: mantiene conexiones listas para mejorar tiempos de respuesta.
- `connection-timeout: 30000`: evita esperas excesivas cuando el pool está saturado.
- `idle-timeout: 600000`: libera conexiones ociosas tras un tiempo razonable.

## Resilience4j

Se aplican patrones de resiliencia en puntos críticos del flujo:

- **Circuit Breaker**: protege la obtención de alertas ante fallos repetidos.
- **Retry**: reintenta la registración de movimientos ante errores transitorios.
- **Rate Limiter**: limita el acceso al historial de movimientos para evitar abuso o sobrecarga.

## Actuator

Actuator se utiliza para observabilidad básica y salud del sistema:

- `health`
- `metrics`
- `info`

Además, se implementó un `HealthIndicator` personalizado para detectar una proporción excesiva de productos en estado crítico.

## Swagger/OpenAPI

La documentación OpenAPI describe:

- `ProductResponse`
- `MovementRequest`
- `MovementResponse`
- `AlertResponse`
- `ErrorResponse`
- `PageResponse`

También documenta respuestas de validación, errores de negocio y códigos HTTP relevantes.

## Pruebas

El backend cuenta con pruebas basadas en:

- JUnit 5
- Mockito
- MockMvc
- JaCoCo para cobertura

Para ejecutar la validación completa:

```bash
mvn clean verify
```

## Inicio de la aplicación

```bash
mvn spring-boot:run
```

## Autor

Mario Mencía  
StockFlow Technical Assessment