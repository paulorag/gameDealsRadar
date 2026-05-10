package com.gamedeals.radar.modules.auth.service;

import com.gamedeals.radar.modules.auth.domain.UserAccount;
import com.gamedeals.radar.modules.auth.repository.UserAccountRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserAccountServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserAccountService userAccountService;

    @Test
    void shouldRegisterUserWhenUsernameDoesNotExist() {
        when(userAccountRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserAccount saved = userAccountService.registerUser("newuser", "password123");

        assertEquals("newuser", saved.getUsername());
        assertEquals("hashed-password", saved.getPassword());
        assertEquals("USER", saved.getRole());
        verify(userAccountRepository).save(any(UserAccount.class));
    }

    @Test
    void shouldThrowExceptionWhenUsernameAlreadyExists() {
        when(userAccountRepository.existsByUsername("existing")).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> userAccountService.registerUser("existing", "password123"));

        verify(userAccountRepository, never()).save(any());
    }
}
