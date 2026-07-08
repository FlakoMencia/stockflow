package com.stockflow.inventory.dto.response;

import com.stockflow.inventory.enums.AlertSeverity;

import java.time.LocalDateTime;

public record AlertResponse(
        Long productId,
        String productSku,
        String productName,
        Integer currentStock,
        Integer minimumStock,
        AlertSeverity severity,
        LocalDateTime generatedAt
) {
}
