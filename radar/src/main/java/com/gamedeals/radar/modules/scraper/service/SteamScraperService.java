package com.gamedeals.radar.modules.scraper.service;

import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;

import lombok.RequiredArgsConstructor;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SteamScraperService {

    private final GameRepository gameRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public void extractAndSaveGame(String url) {
        try {
            String steamAppId = extractAppIdFromUrl(url);
            if (steamAppId == null) {
                System.err.println("URL inválida, não encontrei o ID: " + url);
                return;
            }

            Document doc = Jsoup.connect(url)
                    .cookie("birthtime", "568022401")
                    .cookie("lastagecheckage", "1-0-1988")
                    .cookie("wants_mature_content", "1")
                    .get();

            String title = doc.selectFirst("#appHubAppName").text();
            String imageUrl = doc.selectFirst("img.game_header_image_full").attr("src");

            Element priceElement = doc.selectFirst(".game_purchase_price");
            if (priceElement == null) {
                priceElement = doc.selectFirst(".discount_final_price");
            }
            BigDecimal price = cleanPrice(priceElement != null ? priceElement.text() : null);

            Game game = gameRepository.findBySteamAppId(steamAppId)
                    .orElse(new Game());

            game.setSteamAppId(steamAppId);
            game.setTitle(title);
            game.setUrlLink(url);
            game.setImageUrl(imageUrl);

            gameRepository.save(game);

            PriceHistory history = new PriceHistory();
            history.setGame(game);
            history.setPrice(price);

            priceHistoryRepository.save(history);

            System.out.println("✅ Jogo processado: " + title + " | Preço: " + price);

        } catch (IOException e) {
            System.err.println("Erro de conexão: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Erro inesperado: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private BigDecimal cleanPrice(String priceText) {
        if (priceText == null || priceText.toLowerCase().contains("free")
                || priceText.toLowerCase().contains("gratuito")) {
            return BigDecimal.ZERO;
        }
        String clean = priceText.replaceAll("[^0-9,]", "").replace(",", ".");
        return new BigDecimal(clean);
    }

    private String extractAppIdFromUrl(String url) {
        Pattern pattern = Pattern.compile("app/(\\d+)/");
        Matcher matcher = pattern.matcher(url);
        return matcher.find() ? matcher.group(1) : null;
    }
}