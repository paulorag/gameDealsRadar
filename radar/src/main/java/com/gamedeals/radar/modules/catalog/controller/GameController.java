package com.gamedeals.radar.modules.catalog.controller;

import com.gamedeals.radar.modules.catalog.controller.dto.NewGameRequest;
import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.scraper.service.SteamScraperService; // Importe o service
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final GameRepository gameRepository;
    private final SteamScraperService scraperService; // Injete o Scraper

    @GetMapping
    public ResponseEntity<List<Game>> findAll() {
        return ResponseEntity.ok(gameRepository.findAll());
    }

    // NOVO MÉTODO: Recebe o JSON { "url": "..." } e processa
    @PostMapping
    public ResponseEntity<Void> addGame(@RequestBody NewGameRequest request) {
        // Chama o scraper para ir na Steam, baixar dados e salvar
        scraperService.extractAndSaveGame(request.url());

        // Retorna 201 Created (Sucesso sem corpo de resposta)
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}