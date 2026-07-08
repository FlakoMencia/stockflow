package com.stockflow.inventory.mapper;

import com.stockflow.inventory.dto.response.ProductResponse;
import com.stockflow.inventory.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getCategory(),
                product.getCurrentStock(),
                product.getMinimumStock(),
                product.getUnitPrice(),
                product.getActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
