package com.stockflow.inventory.dto.response;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "Paged response envelope for inventory API resources")
public record PageResponse<T>(
        @ArraySchema(schema = @Schema(description = "Items returned in the current page"))
        List<T> content,
        @Schema(description = "Zero-based page index", example = "0")
        int page,
        @Schema(description = "Page size", example = "10")
        int size,
        @Schema(description = "Total number of matching records", example = "42")
        long totalElements,
        @Schema(description = "Total number of pages", example = "5")
        int totalPages,
        @Schema(description = "Whether this is the first page", example = "true")
        boolean first,
        @Schema(description = "Whether this is the last page", example = "false")
        boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
