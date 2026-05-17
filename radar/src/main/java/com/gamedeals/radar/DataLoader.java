package com.gamedeals.radar;

import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(SteamScraperService scraperService) {
        return args -> {
            System.out.println("Iniciando teste de Scraping...");

            // Usar um UUID fixo para testes
            UUID testUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");

            scraperService.extractAndSaveGame("https://store.steampowered.com/app/2358720/Black_Myth_Wukong/", testUserId);

            scraperService.extractAndSaveGame("https://store.steampowered.com/app/413150/Stardew_Valley/", testUserId);
        };
    }
}