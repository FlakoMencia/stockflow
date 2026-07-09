package com.stockflow.inventory.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        @Schema(description = "Product identifier", example = "1")
        Long id,
        @Schema(description = "Unique product SKU", example = "LAP-DEL-5420")
        String sku,
        @Schema(description = "Product name", example = "Dell Latitude 5420")
        String name,
        @Schema(description = "Product description", example = "Business laptop with 14-inch display and 16 GB RAM")
        String description,
        @Schema(description = "Product category", example = "Electronics")
        String category,
        @Schema(description = "Current stock level", example = "18")
        Integer currentStock,
        @Schema(description = "Minimum stock threshold", example = "5")
        Integer minimumStock,
        @Schema(description = "Unit price", example = "849.99")
        BigDecimal unitPrice,
        @Schema(description = "Whether the product is active", example = "true")
        Boolean active,
        @Schema(description = "Record creation timestamp")
        LocalDateTime createdAt,
        @Schema(description = "Record update timestamp")
        LocalDateTime updatedAt
) {
}
