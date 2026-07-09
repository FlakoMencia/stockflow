package com.stockflow.inventory.actuator;

import com.stockflow.inventory.entity.Product;
import com.stockflow.inventory.repository.ProductRepository;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class CriticalStockHealthIndicator implements HealthIndicator {

    private static final BigDecimal CRITICAL_THRESHOLD_PERCENTAGE = BigDecimal.valueOf(20);

    private final ProductRepository productRepository;

    public CriticalStockHealthIndicator(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Health health() {
        List<Product> products = productRepository.findAll();

        long totalProducts = products.size();
        long criticalProducts = products.stream()
                .filter(product -> product.getCurrentStock() == 0)
                .count();

        BigDecimal criticalPercentage = calculateCriticalPercentage(criticalProducts, totalProducts);

        Health.Builder builder = criticalPercentage.compareTo(CRITICAL_THRESHOLD_PERCENTAGE) > 0 ? Health.down() : Health.up();

        return builder
                .withDetail("criticalPercentage", criticalPercentage)
                .withDetail("criticalProducts", criticalProducts)
                .withDetail("totalProducts", totalProducts)
                .build();
    }

    private BigDecimal calculateCriticalPercentage(long criticalProducts, long totalProducts) {
        if (totalProducts == 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        return BigDecimal.valueOf(criticalProducts)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalProducts), 2, RoundingMode.HALF_UP);
    }
}
