package com.stockflow.inventory.service.impl;

import com.stockflow.inventory.dto.request.MovementRequest;
import com.stockflow.inventory.dto.response.MovementResponse;
import com.stockflow.inventory.entity.Movement;
import com.stockflow.inventory.entity.Product;
import com.stockflow.inventory.enums.MovementType;
import com.stockflow.inventory.exception.InsufficientStockException;
import com.stockflow.inventory.exception.ProductNotFoundException;
import com.stockflow.inventory.mapper.MovementMapper;
import com.stockflow.inventory.repository.MovementRepository;
import com.stockflow.inventory.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovementServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private MovementRepository movementRepository;

    @Mock
    private MovementMapper movementMapper;

    @InjectMocks
    private MovementServiceImpl movementService;

    private Pageable pageable;

    @BeforeEach
    void setUp() {
        pageable = PageRequest.of(0, 10);
    }

    @Test
    void registerMovement_increasesStockAndSavesMovement() {
        Product product = product(1L, 10, 5);
        MovementRequest request = new MovementRequest(1L, MovementType.IN, 5, "Incoming stock");
        MovementResponse response = movementResponse(1L, 1L, MovementType.IN, 5, 10, 15);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(movementMapper.toResponse(any(Movement.class))).thenReturn(response);

        MovementResponse result = movementService.registerMovement(request);

        ArgumentCaptor<Movement> movementCaptor = ArgumentCaptor.forClass(Movement.class);
        verify(movementRepository).save(movementCaptor.capture());
        verify(productRepository).save(product);

        Movement savedMovement = movementCaptor.getValue();
        assertEquals(15, product.getCurrentStock());
        assertEquals(MovementType.IN, savedMovement.getType());
        assertEquals(10, savedMovement.getStockBefore());
        assertEquals(15, savedMovement.getStockAfter());
        assertEquals(response, result);
    }

    @Test
    void registerMovement_decreasesStockForOutMovement() {
        Product product = product(2L, 10, 5);
        MovementRequest request = new MovementRequest(2L, MovementType.OUT, 4, "Stock issue");
        MovementResponse response = movementResponse(2L, 2L, MovementType.OUT, 4, 10, 6);

        when(productRepository.findById(2L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(movementMapper.toResponse(any(Movement.class))).thenReturn(response);

        MovementResponse result = movementService.registerMovement(request);

        ArgumentCaptor<Movement> movementCaptor = ArgumentCaptor.forClass(Movement.class);
        verify(movementRepository).save(movementCaptor.capture());

        Movement savedMovement = movementCaptor.getValue();
        assertEquals(6, product.getCurrentStock());
        assertEquals(MovementType.OUT, savedMovement.getType());
        assertEquals(10, savedMovement.getStockBefore());
        assertEquals(6, savedMovement.getStockAfter());
        assertEquals(response, result);
    }

    @Test
    void registerMovement_throwsInsufficientStock() {
        Product product = product(3L, 2, 5);
        MovementRequest request = new MovementRequest(3L, MovementType.OUT, 5, "Too much stock requested");

        when(productRepository.findById(3L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class, () -> movementService.registerMovement(request));

        verify(productRepository, never()).save(any(Product.class));
        verify(movementRepository, never()).save(any(Movement.class));
    }

    @Test
    void registerMovement_throwsWhenProductMissing() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        MovementRequest request = new MovementRequest(99L, MovementType.IN, 1, "Missing product");

        assertThrows(ProductNotFoundException.class, () -> movementService.registerMovement(request));
    }

    @Test
    void getMovementHistory_returnsMappedHistory() {
        Product product = product(4L, 10, 5);
        Movement movement = new Movement(product, MovementType.OUT, 2, 10, 8, "Adjustment");
        MovementResponse response = movementResponse(1L, 4L, MovementType.OUT, 2, 10, 8);

        when(productRepository.existsById(4L)).thenReturn(true);
        when(movementRepository.findByProductIdOrderByOccurredAtDesc(4L, pageable))
                .thenReturn(new PageImpl<>(List.of(movement), pageable, 1));
        when(movementMapper.toResponse(movement)).thenReturn(response);

        Page<MovementResponse> result = movementService.getMovementHistory(4L, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(response, result.getContent().get(0));
    }

    private Product product(Long id, int currentStock, int minimumStock) {
        Product product = new Product(
                "SKU-" + id,
                "Product " + id,
                "Description",
                "Electronics",
                currentStock,
                minimumStock,
                new BigDecimal("19.99"),
                true
        );
        ReflectionTestUtils.setField(product, "id", id);
        return product;
    }

    private MovementResponse movementResponse(
            Long movementId,
            Long productId,
            MovementType type,
            Integer quantity,
            Integer stockBefore,
            Integer stockAfter
    ) {
        return new MovementResponse(
                movementId,
                productId,
                "SKU-" + productId,
                "Product " + productId,
                type,
                quantity,
                stockBefore,
                stockAfter,
                "Reason",
                null
        );
    }
}
