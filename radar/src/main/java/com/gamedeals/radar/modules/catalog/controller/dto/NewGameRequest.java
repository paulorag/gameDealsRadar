package com.gamedeals.radar.modules.catalog.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record NewGameRequest(
    @NotBlank(message = "URL não pode estar vazia")
    @Pattern(regexp = "^https?://.*steam.*", message = "URL deve ser de um jogo da Steam")
    String url
) {
}