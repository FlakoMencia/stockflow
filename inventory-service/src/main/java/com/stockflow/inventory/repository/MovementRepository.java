package com.stockflow.inventory.repository;

import com.stockflow.inventory.entity.Movement;
import com.stockflow.inventory.enums.MovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MovementRepository extends JpaRepository<Movement, Long> {

    Page<Movement> findByProductId(Long productId, Pageable pageable);

    Page<Movement> findByProductIdOrderByOccurredAtDesc(Long productId, Pageable pageable);

    Page<Movement> findByType(MovementType type, Pageable pageable);

    Page<Movement> findByOccurredAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    List<Movement> findTop10ByProductIdOrderByOccurredAtDesc(Long productId);
}
