package com.stockflow.inventory.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record ErrorResponse(
        @Schema(description = "Timestamp when the error occurred")
        LocalDateTime timestamp,
        @Schema(description = "HTTP status code", example = "404")
        int status,
        @Schema(description = "HTTP status reason phrase", example = "Not Found")
        String error,
        @Schema(description = "Human-readable error message")
        String message,
        @Schema(description = "Request path that caused the error", example = "/api/v1/products/99")
        String path
) {
}
