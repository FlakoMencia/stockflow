# StockFlow - Evaluación Técnica Full Stack

## Introducción
Este repositorio contiene la solución desarrollada para la evaluación técnica StockFlow. El objetivo del proyecto es demostrar las habilidades de deste desarrollador a traves de la implementación de un sistema completo de monitoreo de inventario utilizando Java - Spring Boot en el backend y Angular en el frontend.

La rama actual de desarrollo es:

- `Dev`

## Arquitectura general

### `inventory-service`
Microservicio REST desarrollado con Spring Boot para gestionar productos, movimientos, alertas de stock, observabilidad y documentación de API.

### `inventory-app`
Aplicación SPA desarrollada con Angular para visualizar el inventario, registrar movimientos, consultar alertas y operar sobre la información expuesta por el backend.

## Flujo principal de negocio

```text
Registrar movimiento OUT
        ↓
Actualizar stock del producto
        ↓
Validar stock mínimo
        ↓
Generar alerta de inventario
```

## Estructura del repositorio

```text
stockflow/
├── inventory-service/   Backend Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── inventory-app/       Frontend Angular
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md
```

## Stack tecnológico

### Backend
- Java
- Spring Boot
- Spring Data JPA
- H2
- HikariCP
- Resilience4j
- Actuator
- OpenAPI / Swagger
- JUnit / Mockito
- JaCoCo

### Frontend
- Angular
- Standalone Components
- Lazy Loading
- Signals
- Reactive Forms
- HTTP Interceptor
- `@defer`
- Jasmine / Karma

## Ejecución local

### Backend
```bash
cd inventory-service
mvn spring-boot:run
```

### Frontend
```bash
cd inventory-app
npm install
ng serve
```

## URLs importantes

- Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`
- H2 Console: `http://localhost:8080/api/v1/h2-console`
- Actuator Health: `http://localhost:8080/api/v1/actuator/health`
- Actuator Metrics: `http://localhost:8080/api/v1/actuator/metrics`
- Actuator Info: `http://localhost:8080/api/v1/actuator/info`
- Aplicación Angular: `http://localhost:4200`

## Pruebas Unitarias

### Backend
```bash
cd inventory-service
mvn clean verify
```

Incluye pruebas unitarias e integración con cobertura JaCoCo.

### Frontend
```bash
cd inventory-app
npm test
```

La cobertura se valida con Jasmine/Karma y el reporte generado por Angular.

## Decisiones técnicas

- Arquitectura backend por capas para mantener separación clara de responsabilidades entre controlador, servicio y repositorio.
- DTOs separados de las entidades para desacoplar el contrato de API del modelo de persistencia.
- Manejo global de excepciones para estandarizar respuestas de error y simplificar los controladores.
- Estado global del frontend basado en Signals para reducir complejidad y mejorar la reactividad.
- Degradación controlada ante fallos del backend mediante interceptor HTTP, mensajes globales y manejo consistente de errores.
- Patrones de resiliencia aplicados en puntos críticos para tolerar fallos temporales y proteger el flujo de negocio.


## Autor

Desarrollado por:

**Mario Mencía**

Senior Software Engineer | Java Specialist | Full Stack Development

Evaluación técnica StockFlow