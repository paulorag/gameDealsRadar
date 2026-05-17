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
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class SteamScraperService {

    private final GameRepository gameRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    // Novo método público: adicionar jogo de um usuário
    public void extractAndSaveGame(String url, UUID userId) {
        log.info("Iniciando extração de dados para URL: {} (userId: {})", url, userId);
        try {
            String steamAppId = extractAppIdFromUrl(url);
            if (steamAppId == null) {
                log.warn("URL inválida, não encontrei o ID: {}", url);
                throw new IllegalArgumentException("URL inválida ou não é de um jogo da Steam");
            }

            // Verificar se o usuário já adicionou este jogo
            Optional<Game> existingGame = gameRepository.findByUserIdAndSteamAppId(userId, steamAppId);
            if (existingGame.isPresent()) {
                throw new IllegalArgumentException("Este jogo já foi adicionado na sua lista");
            }

            Document doc = fetchSteamPage(url);
            saveNewGame(doc, steamAppId, url, userId);

        } catch (IOException e) {
            log.error("Erro de conexão ao acessar URL: {}", url, e);
            throw new RuntimeException("Erro ao conectar com a Steam", e);
        } catch (Exception e) {
            log.error("Erro inesperado ao processar URL: {}", url, e);
            throw new RuntimeException("Erro interno ao processar jogo", e);
        }
    }

    // Método público: atualizar preço de um jogo existente (usado por
    // scheduler/job)
    public void updateGamePrice(String url) {
        log.info("Iniciando atualização de preço para URL: {}", url);
        try {
            String steamAppId = extractAppIdFromUrl(url);
            if (steamAppId == null) {
                log.warn("URL inválida, não encontrei o ID: {}", url);
                return;
            }

            // Buscar qualquer instância deste jogo (pode ser de vários usuários)
            Optional<Game> existingGame = gameRepository.findBySteamAppId(steamAppId);
            if (existingGame.isEmpty()) {
                log.info("Jogo não encontrado no banco: {}", steamAppId);
                return;
            }

            Document doc = fetchSteamPage(url);
            updateGamePriceOnly(doc, existingGame.get());

        } catch (IOException e) {
            log.error("Erro de conexão ao acessar URL: {}", url, e);
        } catch (Exception e) {
            log.error("Erro inesperado ao processar URL: {}", url, e);
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

    // Salvar novo jogo para um usuário
    private void saveNewGame(Document doc, String steamAppId, String url, UUID userId) {
        log.debug("Extraindo dados da página para Steam App ID: {}", steamAppId);

        String title = doc.selectFirst("#appHubAppName").text();
        String imageUrl = doc.selectFirst("img.game_header_image_full").attr("src");
        BigDecimal price = extractPrice(doc);

        // Criar novo game associado ao usuário
        Game game = new Game();
        game.setSteamAppId(steamAppId);
        game.setTitle(title);
        game.setUrlLink(url);
        game.setImageUrl(imageUrl);
        game.setUserId(userId);

        gameRepository.save(game);

        PriceHistory history = new PriceHistory();
        history.setGame(game);
        history.setPrice(price);
        priceHistoryRepository.save(history);

        log.info("Novo jogo criado para usuário: {} | {} | Preço: R$ {}", userId, title, price);
    }

    // Atualizar apenas o preço de um jogo existente
    private void updateGamePriceOnly(Document doc, Game game) {
        log.debug("Atualizando preço para: {}", game.getTitle());

        BigDecimal currentPrice = extractPrice(doc);

        // Verificar se o preço mudou
        Optional<PriceHistory> latestPrice = priceHistoryRepository.findFirstByGameOrderByCheckDateDesc(game);

        if (latestPrice.isEmpty() || latestPrice.get().getPrice().compareTo(currentPrice) != 0) {
            PriceHistory history = new PriceHistory();
            history.setGame(game);
            history.setPrice(currentPrice);
            priceHistoryRepository.save(history);

            if (latestPrice.isEmpty()) {
                log.info("Histórico inicial criado para {}: preço R$ {}", game.getTitle(), currentPrice);
            } else {
                log.info("Histórico atualizado para {}: preço alterado para R$ {}", game.getTitle(), currentPrice);
            }
        } else {
            log.debug("Preço inalterado para {}. Nenhum novo histórico registrado.", game.getTitle());
        }
    }

    private BigDecimal extractPrice(Document doc) {
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

        if (priceElement == null) {
            priceElement = doc.selectFirst(".game_purchase_price, .discount_final_price");
        }

        return cleanPrice(priceElement != null ? priceElement.text() : null);
    }

    private BigDecimal cleanPrice(String priceText) {
        if (priceText == null || priceText.trim().isEmpty()
                || priceText.toLowerCase().contains("free")
                || priceText.toLowerCase().contains("gratuito")) {
            return BigDecimal.ZERO;
        }

        String clean = priceText.replaceAll("[^0-9.,]", "").trim();

        if (clean.isEmpty()) {
            return BigDecimal.ZERO;
        }

        if (clean.contains(",")) {
            clean = clean.replace(".", "");
            clean = clean.replace(",", ".");
        }

        try {
            return new BigDecimal(clean);
        } catch (NumberFormatException e) {
            log.warn("Não foi possível fazer parse do preço: {}", priceText);
            return BigDecimal.ZERO;
        }
    }

    private String extractAppIdFromUrl(String url) {
        Pattern pattern = Pattern.compile("app/(\\d+)/");
        Matcher matcher = pattern.matcher(url);
        return matcher.find() ? matcher.group(1) : null;
    }
}