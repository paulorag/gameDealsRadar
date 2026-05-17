package com.gamedeals.radar.modules.catalog.controller.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record GameResponse(
        UUID id,
        String steamAppId,
        String title,
        String urlLink,
        String imageUrl,
        BigDecimal targetPrice) {
}
