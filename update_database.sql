-- Tadado Game Database Update
-- Bu dosya mevcut tablolara yeni veriler ekler

-- Mevcut tabloları kontrol et ve yoksa oluştur
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

CREATE TABLE IF NOT EXISTS game_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(200) NOT NULL,
    forbidden_words TEXT[] NOT NULL,
    difficulty_level INTEGER DEFAULT 1,
    category VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oyun modlarını ekle (eğer yoksa)
INSERT INTO game_modes (name, description, min_players, max_players) VALUES
('Team Mode', 'Classic Tadado with 2 teams, 4+ players', 4, 20),
('Solo Mode', 'Single player mode (coming soon)', 1, 1),
('Party Mode', 'Large group mode (coming soon)', 8, 50)
WHERE NOT EXISTS (SELECT 1 FROM game_modes WHERE name = 'Team Mode');

-- Romance Kartları (İngilizce) - Sadece yoksa ekle
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Love', ARRAY['heart', 'romance', 'kiss', 'relationship'], 1, 'romance', 'en'),
('Wedding', ARRAY['marriage', 'bride', 'groom', 'ceremony'], 1, 'romance', 'en'),
('Valentine', ARRAY['chocolate', 'flowers', 'cupid', 'date'], 1, 'romance', 'en'),
('Honeymoon', ARRAY['vacation', 'trip', 'newlywed', 'romantic'], 2, 'romance', 'en'),
('Proposal', ARRAY['ring', 'kneel', 'marry', 'engagement'], 2, 'romance', 'en'),
('Passion', ARRAY['desire', 'intense', 'emotion', 'feeling'], 3, 'romance', 'en')
ON CONFLICT (word, category, language) DO NOTHING;

-- Travel Kartları (İngilizce)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Airplane', ARRAY['flight', 'pilot', 'wings', 'sky'], 1, 'travel', 'en'),
('Passport', ARRAY['document', 'travel', 'country', 'visa'], 1, 'travel', 'en'),
('Suitcase', ARRAY['bag', 'pack', 'clothes', 'luggage'], 1, 'travel', 'en'),
('Adventure', ARRAY['journey', 'explore', 'discover', 'exciting'], 2, 'travel', 'en'),
('Backpack', ARRAY['bag', 'hiking', 'travel', 'shoulder'], 2, 'travel', 'en'),
('Wanderlust', ARRAY['desire', 'travel', 'wander', 'explore'], 3, 'travel', 'en')
ON CONFLICT (word, category, language) DO NOTHING;

-- Adventure Kartları (İngilizce)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Mountain', ARRAY['peak', 'climb', 'high', 'summit'], 1, 'adventure', 'en'),
('Camping', ARRAY['tent', 'sleep', 'outdoor', 'fire'], 1, 'adventure', 'en'),
('Hiking', ARRAY['walk', 'trail', 'mountain', 'boots'], 1, 'adventure', 'en'),
('Explorer', ARRAY['adventurer', 'discover', 'journey', 'travel'], 2, 'adventure', 'en'),
('Expedition', ARRAY['journey', 'mission', 'explore', 'adventure'], 2, 'adventure', 'en'),
('Thrill', ARRAY['excitement', 'adrenaline', 'rush', 'exhilarating'], 3, 'adventure', 'en')
ON CONFLICT (word, category, language) DO NOTHING;

-- Party Kartları (İngilizce)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Dancing', ARRAY['music', 'move', 'rhythm', 'dance'], 1, 'party', 'en'),
('Celebration', ARRAY['party', 'festival', 'happy', 'joy'], 1, 'party', 'en'),
('Birthday', ARRAY['cake', 'candles', 'age', 'years'], 1, 'party', 'en'),
('Cocktail', ARRAY['drink', 'alcohol', 'bar', 'mix'], 2, 'party', 'en'),
('Festival', ARRAY['celebration', 'music', 'event', 'crowd'], 2, 'party', 'en'),
('Revelry', ARRAY['celebration', 'merry', 'festive', 'jubilation'], 3, 'party', 'en')
ON CONFLICT (word, category, language) DO NOTHING;

-- Romance Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Aşk', ARRAY['kalp', 'romantik', 'öpücük', 'ilişki'], 1, 'romance', 'tr'),
('Düğün', ARRAY['evlilik', 'gelin', 'damat', 'tören'], 1, 'romance', 'tr'),
('Sevgililer', ARRAY['çikolata', 'çiçek', 'aşk', 'randevu'], 1, 'romance', 'tr'),
('Balayı', ARRAY['tatil', 'seyahat', 'yeni evli', 'romantik'], 2, 'romance', 'tr'),
('Evlilik Teklifi', ARRAY['yüzük', 'diz çök', 'evlen', 'nişan'], 2, 'romance', 'tr'),
('Tutku', ARRAY['arzu', 'yoğun', 'duygu', 'hissi'], 3, 'romance', 'tr')
ON CONFLICT (word, category, language) DO NOTHING;

-- Travel Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Uçak', ARRAY['uçuş', 'pilot', 'kanat', 'gökyüzü'], 1, 'travel', 'tr'),
('Pasaport', ARRAY['belge', 'seyahat', 'ülke', 'vize'], 1, 'travel', 'tr'),
('Bavul', ARRAY['çanta', 'paket', 'giysi', 'bagaj'], 1, 'travel', 'tr'),
('Macera', ARRAY['yolculuk', 'keşfet', 'bul', 'heyecanlı'], 2, 'travel', 'tr'),
('Sırt Çantası', ARRAY['çanta', 'yürüyüş', 'seyahat', 'omuz'], 2, 'travel', 'tr'),
('Seyahat Aşkı', ARRAY['arzu', 'seyahat', 'gezin', 'keşfet'], 3, 'travel', 'tr')
ON CONFLICT (word, category, language) DO NOTHING;

-- Adventure Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Dağ', ARRAY['zirve', 'tırman', 'yüksek', 'doruk'], 1, 'adventure', 'tr'),
('Kamp', ARRAY['çadır', 'uyu', 'açık hava', 'ateş'], 1, 'adventure', 'tr'),
('Yürüyüş', ARRAY['yürü', 'patika', 'dağ', 'bot'], 1, 'adventure', 'tr'),
('Kaşif', ARRAY['maceraperest', 'keşfet', 'yolculuk', 'seyahat'], 2, 'adventure', 'tr'),
('Keşif', ARRAY['yolculuk', 'görev', 'keşfet', 'macera'], 2, 'adventure', 'tr'),
('Heyecan', ARRAY['coşku', 'adrenalin', 'hız', 'neşe'], 3, 'adventure', 'tr')
ON CONFLICT (word, category, language) DO NOTHING;

-- Party Kartları (Türkçe)
INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) VALUES
('Dans', ARRAY['müzik', 'hareket', 'ritim', 'oyun'], 1, 'party', 'tr'),
('Kutlama', ARRAY['parti', 'festival', 'mutlu', 'sevinç'], 1, 'party', 'tr'),
('Doğum Günü', ARRAY['pasta', 'mum', 'yaş', 'yıl'], 1, 'party', 'tr'),
('Kokteyl', ARRAY['içecek', 'alkol', 'bar', 'karıştır'], 2, 'party', 'tr'),
('Festival', ARRAY['kutlama', 'müzik', 'etkinlik', 'kalabalık'], 2, 'party', 'tr'),
('Eğlence', ARRAY['kutlama', 'neşeli', 'festival', 'sevinç'], 3, 'party', 'tr')
ON CONFLICT (word, category, language) DO NOTHING;
