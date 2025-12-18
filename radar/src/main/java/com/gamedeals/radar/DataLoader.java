package com.gamedeals.radar;

import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(SteamScraperService scraperService) {
        return args -> {
            System.out.println("Iniciando teste de Scraping...");

            scraperService.extractAndSaveGame("https://store.steampowered.com/app/2358720/Black_Myth_Wukong/");

            scraperService.extractAndSaveGame("https://store.steampowered.com/app/413150/Stardew_Valley/");
        };
    }
}