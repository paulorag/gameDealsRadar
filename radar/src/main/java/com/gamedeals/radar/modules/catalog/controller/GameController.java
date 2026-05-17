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
public class GameController {

    private final GameRepository gameRepository;
    private final SteamScraperService scraperService;
    private final PriceHistoryRepository priceHistoryRepository;
    private final SecurityHelper securityHelper;

    // Endpoint público: Listar jogos mais populares (não autenticado)
    @GetMapping("/popular")
    @Cacheable("popularGames")
    public ResponseEntity<List<PopularGameResponse>> getPopularGames() {
        List<Game> allGames = gameRepository.findAllOrderedBySteamAppId();
        
        // Agrupar por steam_app_id e contar usuários únicos
        var gamesByAppId = allGames.stream()
                .collect(Collectors.groupingBy(
                    Game::getSteamAppId,
                    Collectors.counting()
                ));

        // Mapear para PopularGameResponse ordenado por popularidade
        List<PopularGameResponse> response = gamesByAppId.entrySet()
                .stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue())) // Ordenar decrescente
                .limit(50) // Limitar a 50 jogos
                .map(entry -> {
                    // Pegar o primeiro jogo dessa app_id para os detalhes
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
                            entry.getValue()
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Endpoint autenticado: Listar apenas os jogos do usuário
    @GetMapping("/my")
    @Cacheable(value = "userGames", key = "#root.authentication.name")
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
                        game.getTargetPrice()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Endpoint autenticado: Adicionar novo jogo (com verificação de duplicata por usuário)
    @PostMapping
    @CacheEvict(value = { "userGames", "popularGames" }, allEntries = true)
    public ResponseEntity<Void> addGame(@RequestBody @Valid NewGameRequest request) {
        UUID userId = securityHelper.getCurrentUserId();
        scraperService.extractAndSaveGame(request.url(), userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Endpoint autenticado: Deletar jogo (validar se pertence ao usuário)
    @Transactional
    @DeleteMapping("/{id}")
    @CacheEvict(value = { "userGames", "popularGames", "gameHistory" }, allEntries = true)
    public ResponseEntity<Void> deleteGame(@PathVariable UUID id) {
        UUID userId = securityHelper.getCurrentUserId();
        
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado"));

        // Validar se o jogo pertence ao usuário
        if (!game.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Você não tem permissão para deletar este jogo");
        }

        priceHistoryRepository.deleteAllByGameId(id);
        gameRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // Endpoint autenticado: Visualizar histórico de preço (funciona para qualquer jogo)
    @GetMapping("/{id}/history")
    @Cacheable(value = "gameHistory", key = "#id")
    public ResponseEntity<List<PriceHistory>> getGameHistory(@PathVariable UUID id) {
        List<PriceHistory> history = priceHistoryRepository.findAllByGameIdOrderByCheckDateDesc(id);

        return ResponseEntity.ok(history);
    }
}