package com.stockflow.inventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI stockFlowOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Welcome to StockFlow Inventory API (Evaluation for Mario Mencia)")
                        .version("1.0.0")
                        .description("Inventory monitoring backend service for managing products, movements, alerts, and stock health. By Mario Mencia")
                        .contact(new Contact()
                                .name("StockFlow Team")
                                .email("support@stockflow.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .addServersItem(new Server()
                        .url("/")
                        .description("Default server relative to the application context path"));
    }
}
