package com.stockflow.inventory.controller;

import com.stockflow.inventory.dto.request.MovementRequest;
import com.stockflow.inventory.dto.response.AlertResponse;
import com.stockflow.inventory.dto.response.MovementResponse;
import com.stockflow.inventory.dto.response.ProductResponse;
import com.stockflow.inventory.enums.AlertSeverity;
import com.stockflow.inventory.enums.MovementType;
import com.stockflow.inventory.exception.GlobalExceptionHandler;
import com.stockflow.inventory.exception.InsufficientStockException;
import com.stockflow.inventory.exception.ProductNotFoundException;
import com.stockflow.inventory.service.AlertService;
import com.stockflow.inventory.service.MovementService;
import com.stockflow.inventory.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {ProductController.class, MovementController.class, AlertController.class})
@Import(GlobalExceptionHandler.class)
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private MovementService movementService;

    @MockBean
    private AlertService alertService;

    @Test
    void getProducts_returnsPage() throws Exception {
        ProductResponse response = productResponse(1L, "LAP-1", "Laptop", "Electronics");
        Page<ProductResponse> page = new PageImpl<>(List.of(response), PageRequest.of(0, 10), 1);
        when(productService.getProducts(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].sku").value("LAP-1"));
    }

    @Test
    void getProductsWithCategory_filtersByCategory() throws Exception {
        ProductResponse response = productResponse(2L, "MON-1", "Monitor", "Electronics");
        Page<ProductResponse> page = new PageImpl<>(List.of(response), PageRequest.of(0, 10), 1);
        when(productService.getProductsByCategory(eq("Electronics"), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/products")
                        .param("category", "Electronics")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].category").value("Electronics"));

        verify(productService).getProductsByCategory(eq("Electronics"), any(Pageable.class));
    }

    @Test
    void getProductById_returnsProduct() throws Exception {
        when(productService.getProductById(1L)).thenReturn(productResponse(1L, "LAP-1", "Laptop", "Electronics"));

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sku").value("LAP-1"));
    }

    @Test
    void postMovement_returnsCreatedMovement() throws Exception {
        MovementResponse response = movementResponse(1L, 1L, MovementType.IN, 5, 10, 15);
        when(movementService.registerMovement(any(MovementRequest.class))).thenReturn(response);

        mockMvc.perform(post("/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "productId": 1,
                                  "type": "IN",
                                  "quantity": 5,
                                  "reason": "Incoming stock"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type").value("IN"))
                .andExpect(jsonPath("$.stockAfter").value(15));
    }

    @Test
    void getAlerts_returnsAlerts() throws Exception {
        AlertResponse alert = alertResponse(10L, "TON-1", "Toner", 0, 6, AlertSeverity.CRITICAL);
        when(alertService.getStockAlerts()).thenReturn(List.of(alert));

        mockMvc.perform(get("/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].severity").value("CRITICAL"));
    }

    @Test
    void getMovementHistory_returnsHistory() throws Exception {
        MovementResponse response = movementResponse(1L, 1L, MovementType.OUT, 2, 10, 8);
        when(movementService.getMovementHistory(eq(1L), any(Pageable.class))).thenReturn(
                new PageImpl<>(List.of(response), PageRequest.of(0, 10), 1)
        );

        mockMvc.perform(get("/movements/1/history")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(2));
    }

    @Test
    void getProductById_whenMissing_returns404() throws Exception {
        when(productService.getProductById(99L)).thenThrow(new ProductNotFoundException(99L));

        mockMvc.perform(get("/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.path").value("/products/99"));
    }

    @Test
    void postMovement_whenInsufficientStock_returns422() throws Exception {
        when(movementService.registerMovement(any(MovementRequest.class)))
                .thenThrow(new InsufficientStockException(1L, 50, 5));

        mockMvc.perform(post("/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "productId": 1,
                                  "type": "OUT",
                                  "quantity": 50,
                                  "reason": "Requested too much stock"
                                }
                                """))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.error").value("Unprocessable Entity"))
                .andExpect(jsonPath("$.message").value("Stock insuficiente para el producto 1. Solicitado: 50 unidades. Disponible: 5 unidades."));
    }

    @Test
    void postMovement_whenInvalid_returns400() throws Exception {
        mockMvc.perform(post("/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.path").value("/movements"))
                .andExpect(jsonPath("$.message", containsString("productId")));
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
                LocalDateTime.of(2026, 1, 1, 0, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0)
        );
    }

    private MovementResponse movementResponse(
            Long id,
            Long productId,
            MovementType type,
            Integer quantity,
            Integer stockBefore,
            Integer stockAfter
    ) {
        return new MovementResponse(
                id,
                productId,
                "SKU-" + productId,
                "Product " + productId,
                type,
                quantity,
                stockBefore,
                stockAfter,
                "Reason",
                LocalDateTime.of(2026, 1, 1, 0, 0)
        );
    }

    private AlertResponse alertResponse(
            Long productId,
            String sku,
            String name,
            Integer currentStock,
            Integer minimumStock,
            AlertSeverity severity
    ) {
        return new AlertResponse(
                productId,
                sku,
                name,
                currentStock,
                minimumStock,
                severity,
                LocalDateTime.of(2026, 1, 1, 0, 0)
        );
    }
}
