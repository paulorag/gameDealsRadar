package com.gamedeals.radar.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 100; // Increased from 10 for development
    private static final long TIME_WINDOW_MS = 60 * 1000; // 1 minute

    private final ConcurrentHashMap<String, ClientRequestInfo> clientRequests = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIP = getClientIP(request);

        ClientRequestInfo clientInfo = clientRequests.computeIfAbsent(clientIP, k -> new ClientRequestInfo());

        long currentTime = System.currentTimeMillis();

        // Reset counter if time window has passed
        if (currentTime - clientInfo.windowStartTime > TIME_WINDOW_MS) {
            clientInfo.requestCount.set(0);
            clientInfo.windowStartTime = currentTime;
        }

        long currentCount = clientInfo.requestCount.incrementAndGet();

        if (currentCount > MAX_REQUESTS_PER_MINUTE) {
            log.warn("Rate limit exceeded for IP: {}", clientIP);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class ClientRequestInfo {
        private final AtomicLong requestCount = new AtomicLong(0);
        private volatile long windowStartTime = System.currentTimeMillis();
    }
}