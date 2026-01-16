package com.gamedeals.radar.modules.scraper.service;

import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SteamScraperServiceTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private PriceHistoryRepository priceHistoryRepository;

    @Test
    @DisplayName("Deve extrair dados do HTML e salvar corretamente")
    void shouldExtractAndSaveGame() throws Exception {
        String url = "https://store.steampowered.com/app/12345/Jogo_Teste/";

        String fakeHtml = """
                    <html>
                        <body>
                            <div id="appHubAppName">Super Jogo Teste</div>
                            <img class="game_header_image_full" src="https://steam.com/img.jpg">
                            <div class="game_purchase_price">R$ 199,90</div>
                        </body>
                    </html>
                """;
        Document fakeDoc = Jsoup.parse(fakeHtml);

        SteamScraperService service = new SteamScraperService(gameRepository, priceHistoryRepository);
        SteamScraperService serviceSpy = spy(service);

        doReturn(fakeDoc).when(serviceSpy).fetchSteamPage(anyString());

        when(gameRepository.findBySteamAppId("12345")).thenReturn(Optional.empty());

        serviceSpy.extractAndSaveGame(url);

        ArgumentCaptor<Game> gameCaptor = ArgumentCaptor.forClass(Game.class);
        verify(gameRepository).save(gameCaptor.capture());
        Game savedGame = gameCaptor.getValue();

        assertEquals("Super Jogo Teste", savedGame.getTitle());
        assertEquals("12345", savedGame.getSteamAppId());
        assertEquals("https://steam.com/img.jpg", savedGame.getImageUrl());

        ArgumentCaptor<PriceHistory> historyCaptor = ArgumentCaptor.forClass(PriceHistory.class);
        verify(priceHistoryRepository).save(historyCaptor.capture());
        PriceHistory savedHistory = historyCaptor.getValue();

        assertEquals(new BigDecimal("199.90"), savedHistory.getPrice());
    }
}