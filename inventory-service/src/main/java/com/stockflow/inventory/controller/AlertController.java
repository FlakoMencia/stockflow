package com.stockflow.inventory.controller;

import com.stockflow.inventory.dto.response.AlertResponse;
import com.stockflow.inventory.dto.response.ErrorResponse;
import com.stockflow.inventory.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(
            summary = "Get stock alerts",
            description = "Returns the products whose stock is at or below the configured minimum threshold. (Devuelve los productos que se encuentran en el umbral mínimo de existencias o por debajo de este)"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Alerts retrieved successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AlertResponse.class)))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Unexpected server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<List<AlertResponse>> getStockAlerts() {
        return ResponseEntity.ok(alertService.getStockAlerts());
    }
}
