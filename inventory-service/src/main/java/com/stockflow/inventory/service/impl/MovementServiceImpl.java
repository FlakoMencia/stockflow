package com.stockflow.inventory.service.impl;

import com.stockflow.inventory.dto.request.MovementRequest;
import com.stockflow.inventory.dto.response.MovementResponse;
import com.stockflow.inventory.dto.response.PageResponse;
import com.stockflow.inventory.entity.Movement;
import com.stockflow.inventory.entity.Product;
import com.stockflow.inventory.enums.MovementType;
import com.stockflow.inventory.exception.InsufficientStockException;
import com.stockflow.inventory.exception.ProductNotFoundException;
import com.stockflow.inventory.mapper.MovementMapper;
import com.stockflow.inventory.repository.MovementRepository;
import com.stockflow.inventory.repository.ProductRepository;
import com.stockflow.inventory.service.MovementService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MovementServiceImpl implements MovementService {

    private final ProductRepository productRepository;
    private final MovementRepository movementRepository;
    private final MovementMapper movementMapper;

    public MovementServiceImpl(
            ProductRepository productRepository,
            MovementRepository movementRepository,
            MovementMapper movementMapper
    ) {
        this.productRepository = productRepository;
        this.movementRepository = movementRepository;
        this.movementMapper = movementMapper;
    }

    @Override
    @Transactional
    @Retry(name = "movementRegistration")
    public MovementResponse registerMovement(MovementRequest request) {
        validateRequest(request);
        validateQuantity(request.quantity());

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        Integer stockBefore = product.getCurrentStock();
        applyMovement(product, request);
        Integer stockAfter = product.getCurrentStock();

        Movement movement = new Movement(
                product,
                request.type(),
                request.quantity(),
                stockBefore,
                stockAfter,
                request.reason()
        );

        productRepository.save(product);
        Movement savedMovement = movementRepository.save(movement);

        return movementMapper.toResponse(savedMovement);
    }

    @Override
    @Transactional(readOnly = true)
    @RateLimiter(name = "movementHistory")
    public Page<MovementResponse> getMovementHistory(Long productId, Pageable pageable) {
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException(productId);
        }

        Page<MovementResponse> mov = movementRepository.findByProductIdOrderByOccurredAtDesc(productId, pageable)
                .map(movementMapper::toResponse);
        return mov;
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Movement quantity must be greater than zero");
        }
    }

    private void validateRequest(MovementRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Movement request is required");
        }
        if (request.productId() == null) {
            throw new IllegalArgumentException("Product id is required");
        }
        if (request.type() == null) {
            throw new IllegalArgumentException("Movement type is required");
        }
    }

    private void applyMovement(Product product, MovementRequest request) {
        if (request.type() == MovementType.IN) {
            product.increaseStock(request.quantity());
            return;
        }

        if (request.quantity() > product.getCurrentStock()) {
            throw new InsufficientStockException(
                    product.getId(),
                    request.quantity(),
                    product.getCurrentStock()
            );
        }

        product.decreaseStock(request.quantity());
    }
}
