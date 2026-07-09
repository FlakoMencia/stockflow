package com.stockflow.inventory.entity;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Constructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void testNoArgConstructor() throws Exception {
        Constructor<Product> constructor = Product.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        Product product = constructor.newInstance();
        assertNotNull(product);
    }

    @Test
    void testParameterizedConstructorAndGetters() {
        String sku = "SKU123";
        String name = "Product Name";
        String description = "Product Description";
        String category = "Category";
        Integer currentStock = 10;
        Integer minimumStock = 5;
        BigDecimal unitPrice = new BigDecimal("9.99");
        Boolean active = true;

        Product product = new Product(sku, name, description, category, currentStock, minimumStock, unitPrice, active);

        assertEquals(sku, product.getSku());
        assertEquals(name, product.getName());
        assertEquals(description, product.getDescription());
        assertEquals(category, product.getCategory());
        assertEquals(currentStock, product.getCurrentStock());
        assertEquals(minimumStock, product.getMinimumStock());
        assertEquals(unitPrice, product.getUnitPrice());
        assertEquals(active, product.getActive());
        assertNotNull(product.getMovements());
        assertTrue(product.getMovements().isEmpty());
    }

    @Test
    void testIdAndAuditFields() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        
        assertNull(product.getId());
        assertNull(product.getCreatedAt());
        assertNull(product.getUpdatedAt());

        ReflectionTestUtils.setField(product, "id", 42L);
        assertEquals(42L, product.getId());

        product.prePersist();
        assertNotNull(product.getCreatedAt());
        assertNotNull(product.getUpdatedAt());
        assertEquals(product.getCreatedAt(), product.getUpdatedAt());

        product.preUpdate();
        assertNotNull(product.getUpdatedAt());
    }

    @Test
    void testIncreaseStock_success() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        product.increaseStock(5);
        assertEquals(15, product.getCurrentStock());
    }

    @Test
    void testIncreaseStock_nullQuantity() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> product.increaseStock(null));
        assertEquals("Quantity must be greater than zero", exception.getMessage());
    }

    @Test
    void testIncreaseStock_zeroQuantity() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> product.increaseStock(0));
        assertEquals("Quantity must be greater than zero", exception.getMessage());
    }

    @Test
    void testIncreaseStock_negativeQuantity() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> product.increaseStock(-5));
        assertEquals("Quantity must be greater than zero", exception.getMessage());
    }

    @Test
    void testDecreaseStock_success() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        product.decreaseStock(4);
        assertEquals(6, product.getCurrentStock());
    }

    @Test
    void testDecreaseStock_exactZero() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        product.decreaseStock(10);
        assertEquals(0, product.getCurrentStock());
    }

    @Test
    void testDecreaseStock_nullQuantity() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> product.decreaseStock(null));
        assertEquals("Quantity must be greater than zero", exception.getMessage());
    }

    @Test
    void testDecreaseStock_zeroQuantity() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> product.decreaseStock(0));
        assertEquals("Quantity must be greater than zero", exception.getMessage());
    }

    @Test
    void testDecreaseStock_negativeQuantity() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> product.decreaseStock(-5));
        assertEquals("Quantity must be greater than zero", exception.getMessage());
    }

    @Test
    void testDecreaseStock_insufficientStock() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> product.decreaseStock(11));
        assertEquals("Product stock cannot be negative", exception.getMessage());
    }

    @Test
    void testMovementsList() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        assertNotNull(product.getMovements());
        
        Movement movement = new Movement(product, com.stockflow.inventory.enums.MovementType.IN, 5, 10, 15, "Initial stock");
        product.getMovements().add(movement);
        
        assertEquals(1, product.getMovements().size());
        assertEquals(movement, product.getMovements().get(0));
    }
}
