package com.stockflow.inventory.service.impl;

import com.stockflow.inventory.dto.response.ProductResponse;
import com.stockflow.inventory.entity.Product;
import com.stockflow.inventory.exception.ProductNotFoundException;
import com.stockflow.inventory.mapper.ProductMapper;
import com.stockflow.inventory.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private Pageable pageable;

    @BeforeEach
    void setUp() {
        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getProducts_returnsMappedPage() {
        Product product = product(1L, "LAP-1", "Laptop", "Electronics", 10, 5);
        ProductResponse response = productResponse(1L, "LAP-1", "Laptop", "Electronics");

        when(productRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(product), pageable, 1));
        when(productMapper.toResponse(product)).thenReturn(response);

        Page<ProductResponse> result = productService.getProducts(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(response, result.getContent().get(0));
    }

    @Test
    void getProductsByCategory_returnsMappedPage() {
        Product product = product(2L, "MON-1", "Monitor", "Electronics", 8, 3);
        ProductResponse response = productResponse(2L, "MON-1", "Monitor", "Electronics");

        when(productRepository.findByCategoryIgnoreCase("Electronics", pageable))
                .thenReturn(new PageImpl<>(List.of(product), pageable, 1));
        when(productMapper.toResponse(product)).thenReturn(response);

        Page<ProductResponse> result = productService.getProductsByCategory("Electronics", pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(response, result.getContent().get(0));
    }

    @Test
    void getProductById_returnsMappedProduct() {
        Product product = product(3L, "KBD-1", "Keyboard", "Electronics", 15, 4);
        ProductResponse response = productResponse(3L, "KBD-1", "Keyboard", "Electronics");

        when(productRepository.findById(3L)).thenReturn(Optional.of(product));
        when(productMapper.toResponse(product)).thenReturn(response);

        ProductResponse result = productService.getProductById(3L);

        assertEquals(response, result);
    }

    @Test
    void getProductById_throwsWhenMissing() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.getProductById(99L));
    }

    private Product product(
            Long id,
            String sku,
            String name,
            String category,
            int currentStock,
            int minimumStock
    ) {
        Product product = new Product(
                sku,
                name,
                "Description",
                category,
                currentStock,
                minimumStock,
                new BigDecimal("99.99"),
                true
        );
        ReflectionTestUtils.setField(product, "id", id);
        return product;
    }

    private ProductResponse productResponse(Long id, String sku, String name, String category) {
        return new ProductResponse(
                id,
                sku,
                name,
                "Description",
                category,
                10,
                5,
                new BigDecimal("99.99"),
                true,
                null,
                null
        );
    }
}
