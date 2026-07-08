package com.stockflow.inventory.entity;

import com.stockflow.inventory.enums.MovementType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "movements")
public class Movement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 10)
    private MovementType type;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "stock_before", nullable = false)
    private Integer stockBefore;

    @Column(name = "stock_after", nullable = false)
    private Integer stockAfter;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(name = "occurred_at", nullable = false, updatable = false)
    private LocalDateTime occurredAt;

    protected Movement() {
    }

    public Movement(
            Product product,
            MovementType type,
            Integer quantity,
            Integer stockBefore,
            Integer stockAfter,
            String reason
    ) {
        this.product = product;
        this.type = type;
        this.quantity = quantity;
        this.stockBefore = stockBefore;
        this.stockAfter = stockAfter;
        this.reason = reason;
    }

    @PrePersist
    void prePersist() {
        if (occurredAt == null) {
            occurredAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public MovementType getType() {
        return type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Integer getStockBefore() {
        return stockBefore;
    }

    public Integer getStockAfter() {
        return stockAfter;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getOccurredAt() {
        return occurredAt;
    }
}
