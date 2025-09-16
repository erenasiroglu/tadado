-- Tadado Game Database Schema
-- Bu dosya oyun için gerekli tüm tabloları içerir

-- 1. Oyun Modları Tablosu
CREATE TABLE IF NOT EXISTS game_modes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_players INTEGER NOT NULL DEFAULT 2,
    max_players INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Oyun Kartları Tablosu
CREATE TABLE IF NOT EXISTS game_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(200) NOT NULL,
    forbidden_words TEXT[] NOT NULL, -- Yasaklı kelimeler array olarak
    difficulty_level INTEGER DEFAULT 1, -- 1: Kolay, 2: Orta, 3: Zor
    category VARCHAR(50), -- Kategori (romance, travel, adventure, party, etc.)
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Oyun Oturumları Tablosu
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_mode_id UUID REFERENCES game_modes(id),
    session_name VARCHAR(100),
    deck_language VARCHAR(10) DEFAULT 'en',
    round_duration INTEGER DEFAULT 60, -- Saniye cinsinden
    total_rounds INTEGER DEFAULT 5,
    pass_limit INTEGER DEFAULT 3, -- Pas hakkı
    current_round INTEGER DEFAULT 1,
    current_team_turn INTEGER DEFAULT 1, -- Hangi takımın sırası
    status VARCHAR(20) DEFAULT 'waiting', -- waiting, playing, finished, cancelled
    winner_team_id UUID, -- Kazanan takım
    total_score_team1 INTEGER DEFAULT 0,
    total_score_team2 INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE
);

-- 4. Takımlar Tablosu
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL,
    team_number INTEGER NOT NULL, -- 1 veya 2
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(game_session_id, team_number)
);

-- 5. Oyuncular Tablosu (Takım üyeleri)
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    player_name VARCHAR(100) NOT NULL,
    is_team_captain BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(game_session_id, user_id)
);

-- 6. Oyun Kartları Seçimi (Her oyun için hangi kartların kullanılacağı)
CREATE TABLE IF NOT EXISTS game_session_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    card_id UUID REFERENCES game_cards(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    used_in_round INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Raunt Sonuçları Tablosu
CREATE TABLE IF NOT EXISTS round_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    cards_guessed INTEGER DEFAULT 0, -- Doğru tahmin edilen kart sayısı
    cards_passed INTEGER DEFAULT 0, -- Pas edilen kart sayısı
    cards_failed INTEGER DEFAULT 0, -- Başarısız olan kart sayısı
    round_score INTEGER DEFAULT 0, -- Bu raunttaki puan
    round_duration INTEGER, -- Bu raunttaki süre (saniye)
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(game_session_id, round_number, team_id)
);

-- 8. Kart Tahminleri Detayı
CREATE TABLE IF NOT EXISTS card_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    round_result_id UUID REFERENCES round_results(id) ON DELETE CASCADE,
    card_id UUID REFERENCES game_cards(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    result VARCHAR(20) NOT NULL, -- 'correct', 'passed', 'failed'
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_taken INTEGER -- Bu kart için harcanan süre (saniye)
);

-- 9. Oyun İstatistikleri
CREATE TABLE IF NOT EXISTS game_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_games_played INTEGER DEFAULT 0,
    total_games_won INTEGER DEFAULT 0,
    total_cards_guessed INTEGER DEFAULT 0,
    total_cards_passed INTEGER DEFAULT 0,
    total_cards_failed INTEGER DEFAULT 0,
    average_score_per_game DECIMAL(5,2) DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_game_sessions_host ON game_sessions(host_user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_teams_session ON teams(game_session_id);
CREATE INDEX idx_players_session ON players(game_session_id);
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_game_session_cards_session ON game_session_cards(game_session_id);
CREATE INDEX idx_round_results_session ON round_results(game_session_id);
CREATE INDEX idx_card_attempts_session ON card_attempts(game_session_id);
CREATE INDEX idx_game_cards_language ON game_cards(language);
CREATE INDEX idx_game_cards_category ON game_cards(category);

-- Trigger'lar - updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game_modes_updated_at BEFORE UPDATE ON game_modes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_cards_updated_at BEFORE UPDATE ON game_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_statistics_updated_at BEFORE UPDATE ON game_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Politikaları
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_session_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_statistics ENABLE ROW LEVEL SECURITY;

-- Oyun oturumları için RLS politikaları
CREATE POLICY "Users can view their own game sessions" ON game_sessions
    FOR SELECT USING (auth.uid() = host_user_id);

CREATE POLICY "Users can create game sessions" ON game_sessions
    FOR INSERT WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Users can update their own game sessions" ON game_sessions
    FOR UPDATE USING (auth.uid() = host_user_id);

-- Takımlar için RLS politikaları
CREATE POLICY "Users can view teams in their game sessions" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM game_sessions 
            WHERE game_sessions.id = teams.game_session_id 
            AND game_sessions.host_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create teams in their game sessions" ON teams
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM game_sessions 
            WHERE game_sessions.id = teams.game_session_id 
            AND game_sessions.host_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update teams in their game sessions" ON teams
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM game_sessions 
            WHERE game_sessions.id = teams.game_session_id 
            AND game_sessions.host_user_id = auth.uid()
        )
    );

-- Oyuncular için RLS politikaları
CREATE POLICY "Users can view players in their game sessions" ON players
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM game_sessions 
            WHERE game_sessions.id = players.game_session_id 
            AND game_sessions.host_user_id = auth.uid()
        )
    );

-- İstatistikler için RLS politikaları
CREATE POLICY "Users can view their own statistics" ON game_statistics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics" ON game_statistics
    FOR UPDATE USING (auth.uid() = user_id);

-- Başlangıç verileri
INSERT INTO game_modes (name, description, min_players, max_players) VALUES
('Team Mode', 'Classic Tadado with 2 teams, 4+ players', 4, 20),
('Solo Mode', 'Single player mode (coming soon)', 1, 1),
('Party Mode', 'Large group mode (coming soon)', 8, 50)
ON CONFLICT (name) DO NOTHING;

-- Romance Kartları (İngilizce)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Love', ARRAY['heart', 'romance', 'kiss', 'relationship'], 1, 'romance', 'en'),
('Wedding', ARRAY['marriage', 'bride', 'groom', 'ceremony'], 1, 'romance', 'en'),
('Valentine', ARRAY['chocolate', 'flowers', 'cupid', 'date'], 1, 'romance', 'en'),
('Honeymoon', ARRAY['vacation', 'trip', 'newlywed', 'romantic'], 2, 'romance', 'en'),
('Proposal', ARRAY['ring', 'kneel', 'marry', 'engagement'], 2, 'romance', 'en'),
('Passion', ARRAY['desire', 'intense', 'emotion', 'feeling'], 3, 'romance', 'en');

-- Travel Kartları (İngilizce)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Airplane', ARRAY['flight', 'pilot', 'wings', 'sky'], 1, 'travel', 'en'),
('Passport', ARRAY['document', 'travel', 'country', 'visa'], 1, 'travel', 'en'),
('Suitcase', ARRAY['bag', 'pack', 'clothes', 'luggage'], 1, 'travel', 'en'),
('Adventure', ARRAY['journey', 'explore', 'discover', 'exciting'], 2, 'travel', 'en'),
('Backpack', ARRAY['bag', 'hiking', 'travel', 'shoulder'], 2, 'travel', 'en'),
('Wanderlust', ARRAY['desire', 'travel', 'wander', 'explore'], 3, 'travel', 'en');

-- Adventure Kartları (İngilizce)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Mountain', ARRAY['peak', 'climb', 'high', 'summit'], 1, 'adventure', 'en'),
('Camping', ARRAY['tent', 'sleep', 'outdoor', 'fire'], 1, 'adventure', 'en'),
('Hiking', ARRAY['walk', 'trail', 'mountain', 'boots'], 1, 'adventure', 'en'),
('Explorer', ARRAY['adventurer', 'discover', 'journey', 'travel'], 2, 'adventure', 'en'),
('Expedition', ARRAY['journey', 'mission', 'explore', 'adventure'], 2, 'adventure', 'en'),
('Thrill', ARRAY['excitement', 'adrenaline', 'rush', 'exhilarating'], 3, 'adventure', 'en');

-- Party Kartları (İngilizce)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Dancing', ARRAY['music', 'move', 'rhythm', 'dance'], 1, 'party', 'en'),
('Celebration', ARRAY['party', 'festival', 'happy', 'joy'], 1, 'party', 'en'),
('Birthday', ARRAY['cake', 'candles', 'age', 'years'], 1, 'party', 'en'),
('Cocktail', ARRAY['drink', 'alcohol', 'bar', 'mix'], 2, 'party', 'en'),
('Festival', ARRAY['celebration', 'music', 'event', 'crowd'], 2, 'party', 'en'),
('Revelry', ARRAY['celebration', 'merry', 'festive', 'jubilation'], 3, 'party', 'en');

-- Romance Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Aşk', ARRAY['kalp', 'romantik', 'öpücük', 'ilişki'], 1, 'romance', 'tr'),
('Düğün', ARRAY['evlilik', 'gelin', 'damat', 'tören'], 1, 'romance', 'tr'),
('Sevgililer', ARRAY['çikolata', 'çiçek', 'aşk', 'randevu'], 1, 'romance', 'tr'),
('Balayı', ARRAY['tatil', 'seyahat', 'yeni evli', 'romantik'], 2, 'romance', 'tr'),
('Evlilik Teklifi', ARRAY['yüzük', 'diz çök', 'evlen', 'nişan'], 2, 'romance', 'tr'),
('Tutku', ARRAY['arzu', 'yoğun', 'duygu', 'hissi'], 3, 'romance', 'tr');

-- Travel Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Uçak', ARRAY['uçuş', 'pilot', 'kanat', 'gökyüzü'], 1, 'travel', 'tr'),
('Pasaport', ARRAY['belge', 'seyahat', 'ülke', 'vize'], 1, 'travel', 'tr'),
('Bavul', ARRAY['çanta', 'paket', 'giysi', 'bagaj'], 1, 'travel', 'tr'),
('Macera', ARRAY['yolculuk', 'keşfet', 'bul', 'heyecanlı'], 2, 'travel', 'tr'),
('Sırt Çantası', ARRAY['çanta', 'yürüyüş', 'seyahat', 'omuz'], 2, 'travel', 'tr'),
('Seyahat Aşkı', ARRAY['arzu', 'seyahat', 'gezin', 'keşfet'], 3, 'travel', 'tr');

-- Adventure Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Dağ', ARRAY['zirve', 'tırman', 'yüksek', 'doruk'], 1, 'adventure', 'tr'),
('Kamp', ARRAY['çadır', 'uyu', 'açık hava', 'ateş'], 1, 'adventure', 'tr'),
('Yürüyüş', ARRAY['yürü', 'patika', 'dağ', 'bot'], 1, 'adventure', 'tr'),
('Kaşif', ARRAY['maceraperest', 'keşfet', 'yolculuk', 'seyahat'], 2, 'adventure', 'tr'),
('Keşif', ARRAY['yolculuk', 'görev', 'keşfet', 'macera'], 2, 'adventure', 'tr'),
('Heyecan', ARRAY['coşku', 'adrenalin', 'hız', 'neşe'], 3, 'adventure', 'tr');

-- Party Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Dans', ARRAY['müzik', 'hareket', 'ritim', 'oyun'], 1, 'party', 'tr'),
('Kutlama', ARRAY['parti', 'festival', 'mutlu', 'sevinç'], 1, 'party', 'tr'),
('Doğum Günü', ARRAY['pasta', 'mum', 'yaş', 'yıl'], 1, 'party', 'tr'),
('Kokteyl', ARRAY['içecek', 'alkol', 'bar', 'karıştır'], 2, 'party', 'tr'),
('Festival', ARRAY['kutlama', 'müzik', 'etkinlik', 'kalabalık'], 2, 'party', 'tr'),
('Eğlence', ARRAY['kutlama', 'neşeli', 'festival', 'sevinç'], 3, 'party', 'tr');
