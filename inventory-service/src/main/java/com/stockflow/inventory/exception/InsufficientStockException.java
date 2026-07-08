package com.stockflow.inventory.exception;

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(Long productId, Integer requestedQuantity, Integer currentStock) {
        super("Insufficient stock for product " + productId
                + ". Requested: " + requestedQuantity
                + ", available: " + currentStock);
    }
}
