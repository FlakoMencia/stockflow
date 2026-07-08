package com.stockflow.inventory.repository;

import com.stockflow.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySkuIgnoreCase(String sku);

    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("select p from Product p where p.currentStock <= p.minimumStock and p.active = true")
    List<Product> findProductsBelowMinimumStock();
}
