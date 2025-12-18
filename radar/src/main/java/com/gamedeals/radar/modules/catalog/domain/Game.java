package com.gamedeals.radar.modules.catalog.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "steam_app_id", unique = true, nullable = false)
    private String steamAppId;

    @Column(nullable = false)
    private String title;

    @Column(name = "url_link", nullable = false)
    private String urlLink;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "target_price")
    private java.math.BigDecimal targetPrice;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}