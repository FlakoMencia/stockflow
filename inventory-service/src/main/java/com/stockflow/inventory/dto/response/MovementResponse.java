package com.stockflow.inventory.dto.response;

import com.stockflow.inventory.enums.MovementType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record MovementResponse(
        @Schema(description = "Movement identifier", example = "1")
        Long id,
        @Schema(description = "Related product identifier", example = "1")
        Long productId,
        @Schema(description = "Related product SKU", example = "LAP-DEL-5420")
        String productSku,
        @Schema(description = "Related product name", example = "Dell Latitude 5420")
        String productName,
        @Schema(description = "Movement type", example = "OUT")
        MovementType type,
        @Schema(description = "Moved quantity", example = "5")
        Integer quantity,
        @Schema(description = "Stock before the movement", example = "18")
        Integer stockBefore,
        @Schema(description = "Stock after the movement", example = "13")
        Integer stockAfter,
        @Schema(description = "Movement reason", example = "Stock replenishment")
        String reason,
        @Schema(description = "Movement timestamp")
        LocalDateTime occurredAt
) {
}
