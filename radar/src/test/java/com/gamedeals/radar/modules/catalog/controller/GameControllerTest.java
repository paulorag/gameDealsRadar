package com.gamedeals.radar.modules.catalog.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamedeals.radar.modules.catalog.controller.dto.NewGameRequest;
import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GameController.class)
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @MockitoBean
    private GameRepository gameRepository;

    @MockitoBean
    private SteamScraperService scraperService;

    @MockitoBean
    private PriceHistoryRepository priceHistoryRepository;

    @Test
    @DisplayName("GET /games - Should return list of games")
    void shouldReturnAllGames() throws Exception {
        Game fakeGame = new Game();
        fakeGame.setId(UUID.randomUUID());
        fakeGame.setTitle("Fake Game");

        when(gameRepository.findAll()).thenReturn(List.of(fakeGame));

        mockMvc.perform(get("/games")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Fake Game"));
    }

    @Test
    @DisplayName("POST /games - Should call scraper and return 201 Created")
    void shouldAddGame() throws Exception {
        String url = "https://store.steampowered.com/app/123/Game";
        NewGameRequest request = new NewGameRequest(url);

        mockMvc.perform(post("/games")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        verify(scraperService).extractAndSaveGame(eq(url));
    }

    @Test
    @DisplayName("GET /games/{id}/history - Should return price history")
    void shouldReturnGameHistory() throws Exception {
        UUID gameId = UUID.randomUUID();

        PriceHistory history = new PriceHistory();
        history.setPrice(new BigDecimal("100.00"));
        history.setCheckDate(Instant.now());

        when(priceHistoryRepository.findAllByGameIdOrderByCheckDateDesc(gameId))
                .thenReturn(List.of(history));

        mockMvc.perform(get("/games/{id}/history", gameId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].price").value(100.00));
    }
}