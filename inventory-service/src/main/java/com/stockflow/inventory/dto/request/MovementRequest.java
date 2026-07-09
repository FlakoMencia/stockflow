package com.stockflow.inventory.dto.request;

import com.stockflow.inventory.enums.MovementType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record MovementRequest(
        @Schema(description = "Identifier of the product being moved", example = "1")
        @NotNull
        Long productId,

        @Schema(description = "Movement direction", example = "OUT")
        @NotNull
        MovementType type,

        @Schema(description = "Quantity to register", example = "5")
        @NotNull
        @Positive
        Integer quantity,

        @Schema(description = "Reason for the movement", example = "Stock replenishment")
        @NotBlank
        @Size(max = 255)
        String reason
) {
}
