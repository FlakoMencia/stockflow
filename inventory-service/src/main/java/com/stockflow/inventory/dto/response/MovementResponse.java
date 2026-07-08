package com.stockflow.inventory.dto.response;

import com.stockflow.inventory.enums.MovementType;

import java.time.LocalDateTime;

public record MovementResponse(
        Long id,
        Long productId,
        String productSku,
        String productName,
        MovementType type,
        Integer quantity,
        Integer stockBefore,
        Integer stockAfter,
        String reason,
        LocalDateTime occurredAt
) {
}
