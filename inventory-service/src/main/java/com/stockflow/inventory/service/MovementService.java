package com.stockflow.inventory.service;

import com.stockflow.inventory.dto.request.MovementRequest;
import com.stockflow.inventory.dto.response.MovementResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MovementService {

    MovementResponse registerMovement(MovementRequest request);

    Page<MovementResponse> getMovementHistory(Long productId, Pageable pageable);
}
