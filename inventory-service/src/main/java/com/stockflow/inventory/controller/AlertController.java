package com.stockflow.inventory.controller;

import com.stockflow.inventory.dto.response.AlertResponse;
import com.stockflow.inventory.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getStockAlerts() {
        return ResponseEntity.ok(alertService.getStockAlerts());
    }
}
