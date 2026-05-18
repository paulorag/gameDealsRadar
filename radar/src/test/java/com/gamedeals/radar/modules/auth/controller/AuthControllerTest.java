package com.gamedeals.radar.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamedeals.radar.config.ApiExceptionHandler;
import com.gamedeals.radar.config.jwt.JwtService;
import com.gamedeals.radar.modules.auth.controller.dto.LoginRequest;
import com.gamedeals.radar.modules.auth.controller.dto.RegisterRequest;
import com.gamedeals.radar.modules.auth.domain.UserAccount;
import com.gamedeals.radar.modules.auth.service.UserAccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

        @Mock
        private UserAccountService userAccountService;

        @Mock
        private PasswordEncoder passwordEncoder;

        @Mock
        private JwtService jwtService;

        private MockMvc mockMvc;
        private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

        @BeforeEach
        void setup() {
                AuthController authController = new AuthController(userAccountService, passwordEncoder, jwtService);
                mockMvc = MockMvcBuilders.standaloneSetup(authController)
                                .setControllerAdvice(new ApiExceptionHandler())
                                .build();
        }

        @Test
        @DisplayName("POST /auth/login should return a JWT token when credentials are valid")
        void shouldReturnTokenWhenCredentialsAreValid() throws Exception {
                String username = "valid-user";
                String rawPassword = "password123";

                org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername(username)
                                .password("encoded-password")
                                .roles("USER")
                                .build();

                when(userAccountService.loadUserByUsername(username)).thenReturn(userDetails);
                when(passwordEncoder.matches(rawPassword, "encoded-password")).thenReturn(true);
                when(jwtService.generateToken(username)).thenReturn("jwt-token");

                LoginRequest request = new LoginRequest(username, rawPassword);

                mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token").value("jwt-token"));
        }

        @Test
        @DisplayName("POST /auth/login should return 401 when credentials are invalid")
        void shouldReturnUnauthorizedWhenCredentialsAreInvalid() throws Exception {
                String username = "valid-user";
                String rawPassword = "password123";

                org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername(username)
                                .password("encoded-password")
                                .roles("USER")
                                .build();

                when(userAccountService.loadUserByUsername(username)).thenReturn(userDetails);
                when(passwordEncoder.matches(rawPassword, "encoded-password")).thenReturn(false);

                LoginRequest request = new LoginRequest(username, rawPassword);

                mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isUnauthorized())
                                .andExpect(jsonPath("$.message").value("Usuário ou senha inválidos"));
        }

        @Test
        @DisplayName("POST /auth/register should create a user and return a JWT token")
        void shouldRegisterUserAndReturnToken() throws Exception {
                String username = "newuser";
                String rawPassword = "Password123!";
                UserAccount userAccount = new UserAccount(username, "encoded-password", "USER");

                when(userAccountService.registerUser(eq(username), eq(rawPassword))).thenReturn(userAccount);
                when(jwtService.generateToken(username)).thenReturn("jwt-token");

                RegisterRequest request = new RegisterRequest(username, rawPassword);

                mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.token").value("jwt-token"));
        }

        @Test
        @DisplayName("POST /auth/register should reject passwords that do not meet complexity rules")
        void shouldRejectWeakPasswordOnRegister() throws Exception {
                String username = "newuser";
                String weakPassword = "weakpass";
                RegisterRequest request = new RegisterRequest(username, weakPassword);

                mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.password").value(
                                                "A senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial"));
        }
}
