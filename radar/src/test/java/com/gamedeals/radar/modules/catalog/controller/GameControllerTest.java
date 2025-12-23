package com.gamedeals.radar.modules.catalog.controller;

import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GameController.class)
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GameRepository gameRepository;

    @MockitoBean
    private SteamScraperService scraperService;

    @MockitoBean
    private PriceHistoryRepository priceHistoryRepository;

    @Test
    @DisplayName("Should return list of games with Status 200")
    void shouldReturnAllGames() throws Exception {
        Game fakeGame = Game.builder()
                .id(UUID.randomUUID())
                .title("Fake Game")
                .steamAppId("123")
                .urlLink("http://steam.com")
                .build();

        when(gameRepository.findAll()).thenReturn(List.of(fakeGame));

        mockMvc.perform(get("/games")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Fake Game"));
    }
}