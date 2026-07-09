package com.stockflow.inventory.entity;

import com.stockflow.inventory.enums.MovementType;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Constructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class MovementTest {

    @Test
    void testNoArgConstructor() throws Exception {
        Constructor<Movement> constructor = Movement.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        Movement movement = constructor.newInstance();
        assertNotNull(movement);
    }

    @Test
    void testParameterizedConstructorAndGetters() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        MovementType type = MovementType.IN;
        Integer quantity = 5;
        Integer stockBefore = 10;
        Integer stockAfter = 15;
        String reason = "Stock replenishment";

        Movement movement = new Movement(product, type, quantity, stockBefore, stockAfter, reason);

        assertEquals(product, movement.getProduct());
        assertEquals(type, movement.getType());
        assertEquals(quantity, movement.getQuantity());
        assertEquals(stockBefore, movement.getStockBefore());
        assertEquals(stockAfter, movement.getStockAfter());
        assertEquals(reason, movement.getReason());
        assertNull(movement.getId());
        assertNull(movement.getOccurredAt());
    }

    @Test
    void testId() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        Movement movement = new Movement(product, MovementType.IN, 5, 10, 15, "Reason");
        ReflectionTestUtils.setField(movement, "id", 99L);
        assertEquals(99L, movement.getId());
    }

    @Test
    void testPrePersist_nullOccurredAt() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        Movement movement = new Movement(product, MovementType.IN, 5, 10, 15, "Reason");
        
        assertNull(movement.getOccurredAt());
        movement.prePersist();
        assertNotNull(movement.getOccurredAt());
    }

    @Test
    void testPrePersist_nonNullOccurredAt() {
        Product product = new Product("SKU123", "Name", "Desc", "Cat", 10, 5, BigDecimal.TEN, true);
        Movement movement = new Movement(product, MovementType.IN, 5, 10, 15, "Reason");
        
        LocalDateTime fixedTime = LocalDateTime.now().minusDays(5);
        ReflectionTestUtils.setField(movement, "occurredAt", fixedTime);
        
        movement.prePersist();
        assertEquals(fixedTime, movement.getOccurredAt());
    }
}
