package com.gamedeals.radar.modules.scraper.service;

import com.gamedeals.radar.modules.catalog.domain.Game;
import com.gamedeals.radar.modules.catalog.domain.PriceHistory;
import com.gamedeals.radar.modules.catalog.repository.GameRepository;
import com.gamedeals.radar.modules.catalog.repository.PriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class SteamScraperService {

    private final GameRepository gameRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public void extractAndSaveGame(String url) {
        log.info("Iniciando extração de dados para URL: {}", url);
        try {
            String steamAppId = extractAppIdFromUrl(url);
            if (steamAppId == null) {
                log.warn("URL inválida, não encontrei o ID: {}", url);
                throw new IllegalArgumentException("URL inválida ou não é de um jogo da Steam");
            }

            Document doc = fetchSteamPage(url);

            saveGameData(doc, steamAppId, url);

        } catch (IOException e) {
            log.error("Erro de conexão ao acessar URL: {}", url, e);
            throw new RuntimeException("Erro ao conectar com a Steam", e);
        } catch (Exception e) {
            log.error("Erro inesperado ao processar URL: {}", url, e);
            throw new RuntimeException("Erro interno ao processar jogo", e);
        }
    }

    protected Document fetchSteamPage(String url) throws IOException {
        String urlWithRegion = url.contains("?") ? url + "&cc=br" : url + "?cc=br";
        return Jsoup.connect(urlWithRegion)
                .cookie("birthtime", "568022401")
                .cookie("lastagecheckage", "1-0-1988")
                .cookie("wants_mature_content", "1")
                .cookie("cc", "br")
                .cookie("l", "portuguese")
                .get();
    }

    protected void saveGameData(Document doc, String steamAppId, String url) {
        log.debug("Extraindo dados da página para Steam App ID: {}", steamAppId);

        String title = doc.selectFirst("#appHubAppName").text();
        String imageUrl = doc.selectFirst("img.game_header_image_full").attr("src");

        Elements purchaseAreas = doc.select(".game_area_purchase_game");
        Element priceElement = null;

        for (Element area : purchaseAreas) {
            priceElement = area.selectFirst(".game_purchase_price");

            if (priceElement == null) {
                priceElement = area.selectFirst(".discount_final_price");
            }

            if (priceElement != null) {
                break;
            }
        }

        BigDecimal price = cleanPrice(priceElement != null ? priceElement.text() : null);

        Game game = gameRepository.findBySteamAppId(steamAppId)
                .orElse(new Game());

        boolean isNew = game.getId() == null;
        game.setSteamAppId(steamAppId);
        game.setTitle(title);
        game.setUrlLink(url);
        game.setImageUrl(imageUrl);

        gameRepository.save(game);

        PriceHistory history = new PriceHistory();
        history.setGame(game);
        history.setPrice(price);

        priceHistoryRepository.save(history);

        log.info("Jogo {} processado: {} | Preço: R$ {}", isNew ? "novo" : "atualizado", title, price);
    }

    private BigDecimal cleanPrice(String priceText) {
        if (priceText == null || priceText.toLowerCase().contains("free")
                || priceText.toLowerCase().contains("gratuito")) {
            return BigDecimal.ZERO;
        }

        String clean = priceText.replaceAll("[^0-9.,]", "");

        if (clean.contains(",")) {
            clean = clean.replace(".", "");
            clean = clean.replace(",", ".");
        }

        return new BigDecimal(clean);
    }

    private String extractAppIdFromUrl(String url) {
        Pattern pattern = Pattern.compile("app/(\\d+)/");
        Matcher matcher = pattern.matcher(url);
        return matcher.find() ? matcher.group(1) : null;
    }
}