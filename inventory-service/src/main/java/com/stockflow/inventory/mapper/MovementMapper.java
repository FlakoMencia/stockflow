package com.stockflow.inventory.mapper;

import com.stockflow.inventory.dto.response.MovementResponse;
import com.stockflow.inventory.entity.Movement;
import com.stockflow.inventory.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class MovementMapper {

    public MovementResponse toResponse(Movement movement) {
        Product product = movement.getProduct();

        return new MovementResponse(
                movement.getId(),
                product.getId(),
                product.getSku(),
                product.getName(),
                movement.getType(),
                movement.getQuantity(),
                movement.getStockBefore(),
                movement.getStockAfter(),
                movement.getReason(),
                movement.getOccurredAt()
        );
    }
}
