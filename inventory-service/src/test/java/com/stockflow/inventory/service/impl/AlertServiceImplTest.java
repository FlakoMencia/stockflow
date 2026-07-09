package com.stockflow.inventory.service.impl;

import com.stockflow.inventory.dto.response.AlertResponse;
import com.stockflow.inventory.entity.Product;
import com.stockflow.inventory.enums.AlertSeverity;
import com.stockflow.inventory.mapper.AlertMapper;
import com.stockflow.inventory.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    private AlertServiceImpl alertService;

    @BeforeEach
    void setUp() {
        alertService = new AlertServiceImpl(productRepository, new AlertMapper());
    }

    @Test
    void getStockAlerts_mapsLowAndCriticalAlerts() {
        Product lowStockProduct = product(1L, "LOW-1", 4, 10);
        Product criticalProduct = product(2L, "CRIT-1", 0, 6);

        when(productRepository.findProductsBelowMinimumStock()).thenReturn(List.of(lowStockProduct, criticalProduct));

        List<AlertResponse> alerts = alertService.getStockAlerts();

        assertEquals(2, alerts.size());
        assertEquals(AlertSeverity.LOW, findAlert(alerts, "LOW-1").severity());
        assertEquals(AlertSeverity.CRITICAL, findAlert(alerts, "CRIT-1").severity());
    }

    private Product product(Long id, String sku, int currentStock, int minimumStock) {
        Product product = new Product(
                sku,
                "Product " + id,
                "Description",
                "Electronics",
                currentStock,
                minimumStock,
                new BigDecimal("29.99"),
                true
        );
        ReflectionTestUtils.setField(product, "id", id);
        return product;
    }

    private AlertResponse findAlert(List<AlertResponse> alerts, String sku) {
        return alerts.stream()
                .filter(alert -> sku.equals(alert.productSku()))
                .findFirst()
                .orElseThrow();
    }
}
