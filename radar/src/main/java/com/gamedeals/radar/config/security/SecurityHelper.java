package com.gamedeals.radar.config.security;

import com.gamedeals.radar.modules.auth.repository.UserAccountRepository;
import com.gamedeals.radar.modules.auth.domain.UserAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SecurityHelper {

    private final UserAccountRepository userAccountRepository;

    public UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }

        String username = authentication.getName();
        UserAccount user = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + username));

        return user.getId();
    }

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }
        return authentication.getName();
    }
}
