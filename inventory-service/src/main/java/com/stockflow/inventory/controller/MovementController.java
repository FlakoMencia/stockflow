package com.stockflow.inventory.controller;

import com.stockflow.inventory.dto.request.MovementRequest;
import com.stockflow.inventory.dto.response.MovementResponse;
import com.stockflow.inventory.service.MovementService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movements")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    public ResponseEntity<MovementResponse> registerMovement(@Valid @RequestBody MovementRequest request) {
        MovementResponse response = movementService.registerMovement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{productId}/history")
    public ResponseEntity<List<MovementResponse>> getMovementHistory(
            @PathVariable Long productId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        List<MovementResponse> history = movementService.getMovementHistory(productId, pageable)
                .getContent();

        return ResponseEntity.ok(history);
    }
}
