package com.gamedeals.radar.modules.scheduler;

import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamePriceSchedulerTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private SteamScraperService scraperService;

    @InjectMocks
    private GamePriceScheduler scheduler;

    @Test
    @DisplayName("Deve buscar todos os jogos e atualizar os preços")
    void shouldUpdatePricesForAllGames() {
        Game game1 = new Game();
        game1.setId(UUID.randomUUID());
        game1.setTitle("Black Myth: Wukong");
        game1.setUrlLink("https://store.steampowered.com/app/123/Wukong");

        Game game2 = new Game();
        game2.setId(UUID.randomUUID());
        game2.setTitle("Elden Ring");
        game2.setUrlLink("https://store.steampowered.com/app/456/Elden");

        when(gameRepository.findAll()).thenReturn(List.of(game1, game2));

        scheduler.updateAllGamesPrices();

        verify(gameRepository, times(1)).findAll();

        verify(scraperService).extractAndSaveGame("https://store.steampowered.com/app/123/Wukong");
        verify(scraperService).extractAndSaveGame("https://store.steampowered.com/app/456/Elden");

        verify(scraperService, times(2)).extractAndSaveGame(anyString());
    }
}