package com.gamedeals.radar;

import com.gamedeals.radar.modules.scraper.service.SteamScraperService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.UUID;

@Configuration
@Profile("dev")
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(SteamScraperService scraperService) {
        return args -> {
            System.out.println("Iniciando teste de Scraping...");
            UUID testUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");

            try {
                scraperService.extractAndSaveGame("https://store.steampowered.com/app/2358720/Black_Myth_Wukong/",
                        testUserId);
                scraperService.extractAndSaveGame("https://store.steampowered.com/app/413150/Stardew_Valley/",
                        testUserId);
                System.out.println("Scraping inicial concluído com sucesso!");
            } catch (Exception e) {
                // Se der erro de jogo duplicado, ele cai aqui, avisa, mas NÃO DESLIGA o
                // servidor!
                System.out.println(
                        "⚠️ Scraping inicial ignorado: Jogos já existem no banco de dados ou houve erro de conexão.");
            }
        };
    }
}