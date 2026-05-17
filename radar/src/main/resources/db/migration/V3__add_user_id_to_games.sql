-- Adiciona user_id à tabela games para separar jogos por usuário
ALTER TABLE games 
ADD COLUMN user_id UUID,
ADD CONSTRAINT fk_games_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Índice para melhorar performance ao buscar jogos por usuário
CREATE INDEX idx_games_user_id ON games(user_id);

-- Índice para buscar jogos populares (mais adicionados)
CREATE INDEX idx_games_steam_app_id ON games(steam_app_id);
