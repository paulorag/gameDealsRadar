package com.gamedeals.radar.modules.catalog.controller.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PopularGameResponse(
        UUID id,
        String steamAppId,
        String title,
        String urlLink,
        String imageUrl,
        BigDecimal targetPrice,
        long userCount // Quantos usuários têm este jogo
) {
}
