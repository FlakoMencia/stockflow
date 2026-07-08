package com.stockflow.inventory.dto.request;

import com.stockflow.inventory.enums.MovementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record MovementRequest(
        @NotNull
        Long productId,

        @NotNull
        MovementType type,

        @NotNull
        @Positive
        Integer quantity,

        @NotBlank
        @Size(max = 255)
        String reason
) {
}
