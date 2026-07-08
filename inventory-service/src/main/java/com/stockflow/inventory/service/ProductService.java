package com.stockflow.inventory.service;

import com.stockflow.inventory.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    Page<ProductResponse> getProducts(Pageable pageable);

    Page<ProductResponse> getProductsByCategory(String category, Pageable pageable);

    ProductResponse getProductById(Long productId);
}
