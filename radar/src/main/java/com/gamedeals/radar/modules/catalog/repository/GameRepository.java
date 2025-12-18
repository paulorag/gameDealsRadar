package com.gamedeals.radar.modules.catalog.repository;

import com.gamedeals.radar.modules.catalog.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {
    boolean existsBySteamAppId(String steamAppId);

    Optional<Game> findBySteamAppId(String steamAppId);
}