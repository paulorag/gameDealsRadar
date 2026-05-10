package com.gamedeals.radar.modules.auth.controller;

import com.gamedeals.radar.modules.auth.controller.dto.LoginRequest;
import com.gamedeals.radar.modules.auth.controller.dto.LoginResponse;
import com.gamedeals.radar.modules.auth.controller.dto.RegisterRequest;
import com.gamedeals.radar.modules.auth.domain.UserAccount;
import com.gamedeals.radar.modules.auth.service.UserAccountService;
import com.gamedeals.radar.config.jwt.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserAccountService userAccountService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody @Valid LoginRequest request) {
        UserDetails userDetails = userAccountService.loadUserByUsername(request.username());

        if (!passwordEncoder.matches(request.password(), userDetails.getPassword())) {
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        String token = jwtService.generateToken(userDetails.getUsername());
        return ResponseEntity.ok(new LoginResponse(token, "Bearer"));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody @Valid RegisterRequest request) {
        UserAccount createdUser = userAccountService.registerUser(request.username(), request.password());
        String token = jwtService.generateToken(createdUser.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(token, "Bearer"));
    }
}
