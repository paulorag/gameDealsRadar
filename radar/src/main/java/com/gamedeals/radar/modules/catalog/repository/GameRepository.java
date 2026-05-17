package com.gamedeals.radar.modules.catalog.repository;

import com.gamedeals.radar.modules.catalog.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {
    Optional<Game> findBySteamAppId(String steamAppId);

    // Buscar jogos do usuário logado
    List<Game> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // Verificar se o usuário já adicionou esse jogo (por steam app id)
    Optional<Game> findByUserIdAndSteamAppId(UUID userId, String steamAppId);

    // Buscar todos os jogos para processamento
    @Query("SELECT g FROM Game g WHERE g.steamAppId IS NOT NULL ORDER BY g.steamAppId")
    List<Game> findAllOrderedBySteamAppId();
}