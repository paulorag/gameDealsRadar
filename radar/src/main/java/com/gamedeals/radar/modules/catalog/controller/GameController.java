package com.gamedeals.radar.modules.catalog.controller;

import com.gamedeals.radar.config.security.SecurityHelper;
import com.gamedeals.radar.modules.catalog.controller.dto.GameResponse;
import com.gamedeals.radar.modules.catalog.controller.dto.NewGameRequest;
import com.gamedeals.radar.modules.catalog.controller.dto.PopularGameResponse;
import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

    private final GameRepository gameRepository;
    private final SteamScraperService scraperService;
    private final PriceHistoryRepository priceHistoryRepository;
    private final SecurityHelper securityHelper;

    @GetMapping("/popular")
    @Cacheable("popularGames")
    public ResponseEntity<List<PopularGameResponse>> getPopularGames() {
        List<Game> allGames = gameRepository.findAllOrderedBySteamAppId();

        var gamesByAppId = allGames.stream()
                .collect(Collectors.groupingBy(
                        Game::getSteamAppId,
                        Collectors.counting()));

        List<PopularGameResponse> response = gamesByAppId.entrySet()
                .stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(50)
                .map(entry -> {

                    Game game = allGames.stream()
                            .filter(g -> g.getSteamAppId().equals(entry.getKey()))
                            .findFirst()
                            .orElseThrow();
                    return new PopularGameResponse(
                            game.getId(),
                            game.getSteamAppId(),
                            game.getTitle(),
                            game.getUrlLink(),
                            game.getImageUrl(),
                            game.getTargetPrice(),
                            entry.getValue());
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @Cacheable(value = "userGames", key = "@securityHelper.getCurrentUserId()")
    public ResponseEntity<List<GameResponse>> getMyGames() {
        UUID userId = securityHelper.getCurrentUserId();
        List<Game> games = gameRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<GameResponse> response = games.stream()
                .map(game -> new GameResponse(
                        game.getId(),
                        game.getSteamAppId(),
                        game.getTitle(),
                        game.getUrlLink(),
                        game.getImageUrl(),
                        game.getTargetPrice()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @CacheEvict(value = { "userGames", "popularGames" }, allEntries = true)
    public ResponseEntity<Void> addGame(@RequestBody @Valid NewGameRequest request) {
        UUID userId = securityHelper.getCurrentUserId();
        scraperService.extractAndSaveGame(request.url(), userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Transactional
    @DeleteMapping("/{id}")
    @CacheEvict(value = { "userGames", "popularGames", "gameHistory" }, allEntries = true)
    public ResponseEntity<Void> deleteGame(@PathVariable UUID id) {
        UUID userId = securityHelper.getCurrentUserId();

        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado"));

        if (!game.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Você não tem permissão para deletar este jogo");
        }

        priceHistoryRepository.deleteAllByGameId(id);
        gameRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    @Cacheable(value = "gameHistory", key = "#id")
    public ResponseEntity<List<PriceHistory>> getGameHistory(@PathVariable UUID id) {
        List<PriceHistory> history = priceHistoryRepository.findAllByGameIdOrderByCheckDateDesc(id);

        return ResponseEntity.ok(history);
    }
}