package com.gamedeals.radar.modules.catalog.controller;

import com.gamedeals.radar.config.security.SecurityHelper;
import com.gamedeals.radar.modules.catalog.controller.dto.NewGameRequest;
import com.gamedeals.radar.modules.catalog.controller.dto.PopularGameResponse;
import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GameControllerUnitTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private SteamScraperService scraperService;

    @Mock
    private PriceHistoryRepository priceHistoryRepository;

    @Mock
    private SecurityHelper securityHelper;

    @InjectMocks
    private GameController gameController;

    @Test
    @DisplayName("getPopularGames should return games ordered by how many users added them")
    void shouldReturnPopularGamesSortedByFrequency() {
        Game gameA1 = new Game();
        gameA1.setId(UUID.randomUUID());
        gameA1.setSteamAppId("100");
        gameA1.setTitle("First Game");
        gameA1.setUrlLink("https://store.steampowered.com/app/100/first");
        gameA1.setImageUrl("https://cdn.example/first.jpg");

        Game gameA2 = new Game();
        gameA2.setId(UUID.randomUUID());
        gameA2.setSteamAppId("100");
        gameA2.setTitle("First Game");
        gameA2.setUrlLink("https://store.steampowered.com/app/100/first");
        gameA2.setImageUrl("https://cdn.example/first.jpg");

        Game gameB = new Game();
        gameB.setId(UUID.randomUUID());
        gameB.setSteamAppId("200");
        gameB.setTitle("Second Game");
        gameB.setUrlLink("https://store.steampowered.com/app/200/second");
        gameB.setImageUrl("https://cdn.example/second.jpg");

        when(gameRepository.findAllOrderedBySteamAppId()).thenReturn(List.of(gameA1, gameB, gameA2));

        ResponseEntity<List<PopularGameResponse>> response = gameController.getPopularGames();

        assertEquals(200, response.getStatusCode().value());
        List<PopularGameResponse> body = response.getBody();
        assertEquals(2, body.size());
        assertEquals("100", body.get(0).steamAppId());
        assertEquals(2L, body.get(0).userCount());
        assertEquals("200", body.get(1).steamAppId());
    }

    @Test
    @DisplayName("addGame should pass the current user ID to the scraper service")
    void shouldAddGameWithCurrentUserId() {
        UUID currentUserId = UUID.randomUUID();
        String url = "https://store.steampowered.com/app/123456/current-game";

        when(securityHelper.getCurrentUserId()).thenReturn(currentUserId);

        ResponseEntity<Void> response = gameController.addGame(new NewGameRequest(url));

        assertEquals(201, response.getStatusCode().value());
        verify(scraperService).extractAndSaveGame(url, currentUserId);
    }

    @Test
    @DisplayName("deleteGame should reject requests from a different user")
    void shouldRejectDeleteWhenUserDoesNotOwnGame() {
        UUID gameId = UUID.randomUUID();
        Game game = new Game();
        game.setId(gameId);
        game.setUserId(UUID.randomUUID());

        when(gameRepository.findById(gameId)).thenReturn(Optional.of(game));
        when(securityHelper.getCurrentUserId()).thenReturn(UUID.randomUUID());

        assertThrows(IllegalArgumentException.class, () -> gameController.deleteGame(gameId));
    }

    @Test
    @DisplayName("getGameHistory should return price history by game ID")
    void shouldReturnGameHistory() {
        UUID gameId = UUID.randomUUID();
        PriceHistory history = new PriceHistory();
        history.setPrice(BigDecimal.valueOf(79.99));
        history.setCheckDate(Instant.now());

        when(priceHistoryRepository.findAllByGameIdOrderByCheckDateDesc(gameId)).thenReturn(List.of(history));

        ResponseEntity<List<PriceHistory>> response = gameController.getGameHistory(gameId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals(BigDecimal.valueOf(79.99), response.getBody().get(0).getPrice());
    }
}
