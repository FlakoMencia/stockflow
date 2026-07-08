package com.stockflow.inventory.service.impl;

import com.stockflow.inventory.dto.response.AlertResponse;
import com.stockflow.inventory.mapper.AlertMapper;
import com.stockflow.inventory.repository.ProductRepository;
import com.stockflow.inventory.service.AlertService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AlertServiceImpl implements AlertService {

    private final ProductRepository productRepository;
    private final AlertMapper alertMapper;

    public AlertServiceImpl(ProductRepository productRepository, AlertMapper alertMapper) {
        this.productRepository = productRepository;
        this.alertMapper = alertMapper;
    }

    @Override
    @CircuitBreaker(name = "stockAlerts", fallbackMethod = "getStockAlertsFallback")
    public List<AlertResponse> getStockAlerts() {
        return productRepository.findProductsBelowMinimumStock()
                .stream()
                .map(alertMapper::toResponse)
                .toList();
    }

    private List<AlertResponse> getStockAlertsFallback(Throwable throwable) {
        return Collections.emptyList();
    }
}
