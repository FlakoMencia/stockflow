package com.stockflow.inventory.service.impl;

import com.stockflow.inventory.dto.response.ProductResponse;
import com.stockflow.inventory.exception.ProductNotFoundException;
import com.stockflow.inventory.mapper.ProductMapper;
import com.stockflow.inventory.repository.ProductRepository;
import com.stockflow.inventory.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Override
    public Page<ProductResponse> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(productMapper::toResponse);
    }

    @Override
    public Page<ProductResponse> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategoryIgnoreCase(category, pageable)
                .map(productMapper::toResponse);
    }

    @Override
    public ProductResponse getProductById(Long productId) {
        return productRepository.findById(productId)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }
}
