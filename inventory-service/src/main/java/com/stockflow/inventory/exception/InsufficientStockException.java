package com.stockflow.inventory.exception;

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(Long productId, Integer requestedQuantity, Integer currentStock) {
        super("Stock insuficiente para el producto " + productId
                + ". Solicitado: " + requestedQuantity + " unidades."
                + " Disponible: " + currentStock + " unidades.");
    }
}
