package com.gamedeals.radar.modules.scheduler;

import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class GamePriceScheduler {

    private final GameRepository gameRepository;
    private final SteamScraperService scraperService;

    @Scheduled(fixedDelay = 60000)
    public void updateAllGamesPrices() {
        log.info("🔄 Iniciando atualização automática de preços...");

        List<Game> games = gameRepository.findAll();

        if (games.isEmpty()) {
            log.info("⚠️ Nenhum jogo cadastrado para atualizar.");
            return;
        }

        log.info("🎮 Encontrados {} jogos para verificar.", games.size());

        for (Game game : games) {
            try {
                log.debug("Verificando: {}", game.getTitle());
                scraperService.extractAndSaveGame(game.getUrlLink());
            } catch (Exception e) {
                log.error("❌ Falha ao atualizar jogo: {}", game.getTitle(), e);
            }
        }

        log.info("✅ Atualização concluída.");
    }
}