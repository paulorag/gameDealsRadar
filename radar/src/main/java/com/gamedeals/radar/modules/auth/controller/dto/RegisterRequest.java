package com.gamedeals.radar.modules.auth.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
                @NotBlank(message = "O nome de usuário é obrigatório") String username,
                @NotBlank(message = "A senha é obrigatória") @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*\\W).{8,}$", message = "A senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial") String password) {
}
