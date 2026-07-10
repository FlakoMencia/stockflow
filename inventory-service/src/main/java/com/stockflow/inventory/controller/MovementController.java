package com.stockflow.inventory.controller;

import com.stockflow.inventory.dto.request.MovementRequest;
import com.stockflow.inventory.dto.response.ErrorResponse;
import com.stockflow.inventory.dto.response.MovementResponse;
import com.stockflow.inventory.service.MovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/movements")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    @Operation(
            summary = "Register movement",
            description = "Registers an inventory movement and updates product stock in one transaction.(Registra un movimiento de inventario y actualiza las existencias del producto en una sola transacción)"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Movement created successfully",
                    content = @Content(schema = @Schema(implementation = MovementResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "422",
                    description = "Insufficient stock",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Unexpected server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<MovementResponse> registerMovement(@Valid @RequestBody MovementRequest request) {
        MovementResponse response = movementService.registerMovement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{productId}/history")
    @Operation(
            summary = "Get movement history",
            description = "Returns the movement history for a product.(Devuelve el historial de movimientos de un producto)"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Movement history retrieved successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = MovementResponse.class)))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "429",
                    description = "Too many requests",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Unexpected server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<List<MovementResponse>> getMovementHistory(
            @PathVariable Long productId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        List<MovementResponse> history = movementService.getMovementHistory(productId, pageable)
                .getContent();

        return ResponseEntity.ok(history);
    }
}
