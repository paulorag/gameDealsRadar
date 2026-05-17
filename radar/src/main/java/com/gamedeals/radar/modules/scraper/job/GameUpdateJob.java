package com.gamedeals.radar.modules.scraper.job;

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
public class GameUpdateJob {

    private final GameRepository gameRepository;
    private final SteamScraperService scraperService;

    @Scheduled(fixedDelay = 3600000)
    public void updateAllGames() {
        log.info("🔄 Iniciando rotina de atualização de preços...");

        List<Game> games = gameRepository.findAll();

        for (Game game : games) {
            try {
                log.info("Atualizando: {}", game.getTitle());
                scraperService.updateGamePrice(game.getUrlLink());

                Thread.sleep(2000);
            } catch (Exception e) {
                log.error("Falha ao atualizar {}", game.getTitle(), e);
            }
        }

        log.info("✅ Rotina finalizada! {} jogos verificados.", games.size());
    }
}