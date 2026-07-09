package com.stockflow.inventory.dto.response;

import com.stockflow.inventory.enums.AlertSeverity;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record AlertResponse(
        @Schema(description = "Related product identifier", example = "10")
        Long productId,
        @Schema(description = "Related product SKU", example = "TON-HP-206A")
        String productSku,
        @Schema(description = "Related product name", example = "HP 206A Black Toner")
        String productName,
        @Schema(description = "Current stock level", example = "0")
        Integer currentStock,
        @Schema(description = "Minimum stock threshold", example = "6")
        Integer minimumStock,
        @Schema(description = "Alert severity", example = "CRITICAL")
        AlertSeverity severity,
        @Schema(description = "Alert generation timestamp")
        LocalDateTime generatedAt
) {
}
