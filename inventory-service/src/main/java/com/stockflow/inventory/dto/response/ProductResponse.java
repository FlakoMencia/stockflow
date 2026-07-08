package com.stockflow.inventory.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String description,
        String category,
        Integer currentStock,
        Integer minimumStock,
        BigDecimal unitPrice,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
