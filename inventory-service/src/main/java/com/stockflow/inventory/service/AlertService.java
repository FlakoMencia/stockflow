package com.stockflow.inventory.service;

import com.stockflow.inventory.dto.response.AlertResponse;

import java.util.List;

public interface AlertService {

    List<AlertResponse> getStockAlerts();
}
