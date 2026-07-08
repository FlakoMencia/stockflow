package com.stockflow.inventory.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String sku;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 300)
    private String description;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock;

    @Column(name = "minimum_stock", nullable = false)
    private Integer minimumStock;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Movement> movements = new ArrayList<>();

    protected Product() {
    }

    public Product(
            String sku,
            String name,
            String description,
            String category,
            Integer currentStock,
            Integer minimumStock,
            BigDecimal unitPrice,
            Boolean active
    ) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.category = category;
        this.currentStock = currentStock;
        this.minimumStock = minimumStock;
        this.unitPrice = unitPrice;
        this.active = active;
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public Integer getMinimumStock() {
        return minimumStock;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<Movement> getMovements() {
        return movements;
    }

    public void increaseStock(Integer quantity) {
        requirePositiveQuantity(quantity);
        currentStock += quantity;
    }

    public void decreaseStock(Integer quantity) {
        requirePositiveQuantity(quantity);
        int newStock = currentStock - quantity;
        if (newStock < 0) {
            throw new IllegalStateException("Product stock cannot be negative");
        }
        currentStock = newStock;
    }

    private void requirePositiveQuantity(Integer quantity) {
        if (Objects.isNull(quantity) || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
    }
}
