package com.stockflow.inventory.mapper;

import com.stockflow.inventory.dto.response.AlertResponse;
import com.stockflow.inventory.entity.Product;
import com.stockflow.inventory.enums.AlertSeverity;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AlertMapper {

    public AlertResponse toResponse(Product product) {
        return new AlertResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getCurrentStock(),
                product.getMinimumStock(),
                resolveSeverity(product),
                LocalDateTime.now()
        );
    }

    private AlertSeverity resolveSeverity(Product product) {
        if (product.getCurrentStock() == 0) {
            return AlertSeverity.CRITICAL;
        }
        return AlertSeverity.LOW;
    }
}
