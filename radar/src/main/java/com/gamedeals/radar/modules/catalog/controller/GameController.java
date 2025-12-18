package com.gamedeals.radar.modules.catalog.controller;

import com.gamedeals.radar.modules.catalog.controller.dto.NewGameRequest;
import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final GameRepository gameRepository;
    private final SteamScraperService scraperService;
    private final PriceHistoryRepository priceHistoryRepository;

    @GetMapping
    public ResponseEntity<List<Game>> findAll() {
        return ResponseEntity.ok(gameRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Void> addGame(@RequestBody NewGameRequest request) {
        scraperService.extractAndSaveGame(request.url());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<PriceHistory>> getGameHistory(@PathVariable UUID id) {
        List<PriceHistory> history = priceHistoryRepository.findAllByGameIdOrderByCheckDateDesc(id);

        return ResponseEntity.ok(history);
    }
}