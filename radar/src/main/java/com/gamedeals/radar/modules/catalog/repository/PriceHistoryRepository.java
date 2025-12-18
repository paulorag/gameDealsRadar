package com.gamedeals.radar.modules.catalog.repository;

import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, UUID> {
    List<PriceHistory> findAllByGameIdOrderByCheckDateDesc(UUID gameId);
}