-- Tadado Game Database Update - Simple Version
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
DO $$
BEGIN
    -- Team Mode
    IF NOT EXISTS (SELECT 1 FROM game_modes WHERE name = 'Team Mode') THEN
        INSERT INTO game_modes (name, description, min_players, max_players) 
        VALUES ('Team Mode', 'Classic Tadado with 2 teams, 4+ players', 4, 20);
    END IF;
    
    -- Solo Mode
    IF NOT EXISTS (SELECT 1 FROM game_modes WHERE name = 'Solo Mode') THEN
        INSERT INTO game_modes (name, description, min_players, max_players) 
        VALUES ('Solo Mode', 'Single player mode (coming soon)', 1, 1);
    END IF;
    
    -- Party Mode
    IF NOT EXISTS (SELECT 1 FROM game_modes WHERE name = 'Party Mode') THEN
        INSERT INTO game_modes (name, description, min_players, max_players) 
        VALUES ('Party Mode', 'Large group mode (coming soon)', 8, 50);
    END IF;
END $$;

-- Romance Kartları (İngilizce)
DO $$
BEGIN
    -- Love
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Love' AND category = 'romance' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Love', ARRAY['heart', 'romance', 'kiss', 'relationship'], 1, 'romance', 'en');
    END IF;
    
    -- Wedding
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Wedding' AND category = 'romance' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Wedding', ARRAY['marriage', 'bride', 'groom', 'ceremony'], 1, 'romance', 'en');
    END IF;
    
    -- Valentine
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Valentine' AND category = 'romance' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Valentine', ARRAY['chocolate', 'flowers', 'cupid', 'date'], 1, 'romance', 'en');
    END IF;
    
    -- Honeymoon
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Honeymoon' AND category = 'romance' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Honeymoon', ARRAY['vacation', 'trip', 'newlywed', 'romantic'], 2, 'romance', 'en');
    END IF;
    
    -- Proposal
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Proposal' AND category = 'romance' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Proposal', ARRAY['ring', 'kneel', 'marry', 'engagement'], 2, 'romance', 'en');
    END IF;
    
    -- Passion
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Passion' AND category = 'romance' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Passion', ARRAY['desire', 'intense', 'emotion', 'feeling'], 3, 'romance', 'en');
    END IF;
END $$;

-- Travel Kartları (İngilizce)
DO $$
BEGIN
    -- Airplane
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Airplane' AND category = 'travel' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Airplane', ARRAY['flight', 'pilot', 'wings', 'sky'], 1, 'travel', 'en');
    END IF;
    
    -- Passport
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Passport' AND category = 'travel' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Passport', ARRAY['document', 'travel', 'country', 'visa'], 1, 'travel', 'en');
    END IF;
    
    -- Suitcase
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Suitcase' AND category = 'travel' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Suitcase', ARRAY['bag', 'pack', 'clothes', 'luggage'], 1, 'travel', 'en');
    END IF;
    
    -- Adventure
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Adventure' AND category = 'travel' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Adventure', ARRAY['journey', 'explore', 'discover', 'exciting'], 2, 'travel', 'en');
    END IF;
    
    -- Backpack
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Backpack' AND category = 'travel' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Backpack', ARRAY['bag', 'hiking', 'travel', 'shoulder'], 2, 'travel', 'en');
    END IF;
    
    -- Wanderlust
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Wanderlust' AND category = 'travel' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Wanderlust', ARRAY['desire', 'travel', 'wander', 'explore'], 3, 'travel', 'en');
    END IF;
END $$;

-- Adventure Kartları (İngilizce)
DO $$
BEGIN
    -- Mountain
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Mountain' AND category = 'adventure' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Mountain', ARRAY['peak', 'climb', 'high', 'summit'], 1, 'adventure', 'en');
    END IF;
    
    -- Camping
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Camping' AND category = 'adventure' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Camping', ARRAY['tent', 'sleep', 'outdoor', 'fire'], 1, 'adventure', 'en');
    END IF;
    
    -- Hiking
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Hiking' AND category = 'adventure' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Hiking', ARRAY['walk', 'trail', 'mountain', 'boots'], 1, 'adventure', 'en');
    END IF;
    
    -- Explorer
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Explorer' AND category = 'adventure' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Explorer', ARRAY['adventurer', 'discover', 'journey', 'travel'], 2, 'adventure', 'en');
    END IF;
    
    -- Expedition
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Expedition' AND category = 'adventure' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Expedition', ARRAY['journey', 'mission', 'explore', 'adventure'], 2, 'adventure', 'en');
    END IF;
    
    -- Thrill
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Thrill' AND category = 'adventure' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Thrill', ARRAY['excitement', 'adrenaline', 'rush', 'exhilarating'], 3, 'adventure', 'en');
    END IF;
END $$;

-- Party Kartları (İngilizce)
DO $$
BEGIN
    -- Dancing
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Dancing' AND category = 'party' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Dancing', ARRAY['music', 'move', 'rhythm', 'dance'], 1, 'party', 'en');
    END IF;
    
    -- Celebration
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Celebration' AND category = 'party' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Celebration', ARRAY['party', 'festival', 'happy', 'joy'], 1, 'party', 'en');
    END IF;
    
    -- Birthday
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Birthday' AND category = 'party' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Birthday', ARRAY['cake', 'candles', 'age', 'years'], 1, 'party', 'en');
    END IF;
    
    -- Cocktail
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Cocktail' AND category = 'party' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Cocktail', ARRAY['drink', 'alcohol', 'bar', 'mix'], 2, 'party', 'en');
    END IF;
    
    -- Festival
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Festival' AND category = 'party' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Festival', ARRAY['celebration', 'music', 'event', 'crowd'], 2, 'party', 'en');
    END IF;
    
    -- Revelry
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Revelry' AND category = 'party' AND language = 'en') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Revelry', ARRAY['celebration', 'merry', 'festive', 'jubilation'], 3, 'party', 'en');
    END IF;
END $$;

-- Romance Kartları (Türkçe)
DO $$
BEGIN
    -- Aşk
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Aşk' AND category = 'romance' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Aşk', ARRAY['kalp', 'romantik', 'öpücük', 'ilişki'], 1, 'romance', 'tr');
    END IF;
    
    -- Düğün
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Düğün' AND category = 'romance' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Düğün', ARRAY['evlilik', 'gelin', 'damat', 'tören'], 1, 'romance', 'tr');
    END IF;
    
    -- Sevgililer
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Sevgililer' AND category = 'romance' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Sevgililer', ARRAY['çikolata', 'çiçek', 'aşk', 'randevu'], 1, 'romance', 'tr');
    END IF;
    
    -- Balayı
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Balayı' AND category = 'romance' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Balayı', ARRAY['tatil', 'seyahat', 'yeni evli', 'romantik'], 2, 'romance', 'tr');
    END IF;
    
    -- Evlilik Teklifi
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Evlilik Teklifi' AND category = 'romance' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Evlilik Teklifi', ARRAY['yüzük', 'diz çök', 'evlen', 'nişan'], 2, 'romance', 'tr');
    END IF;
    
    -- Tutku
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Tutku' AND category = 'romance' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Tutku', ARRAY['arzu', 'yoğun', 'duygu', 'hissi'], 3, 'romance', 'tr');
    END IF;
END $$;

-- Travel Kartları (Türkçe)
DO $$
BEGIN
    -- Uçak
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Uçak' AND category = 'travel' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Uçak', ARRAY['uçuş', 'pilot', 'kanat', 'gökyüzü'], 1, 'travel', 'tr');
    END IF;
    
    -- Pasaport
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Pasaport' AND category = 'travel' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Pasaport', ARRAY['belge', 'seyahat', 'ülke', 'vize'], 1, 'travel', 'tr');
    END IF;
    
    -- Bavul
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Bavul' AND category = 'travel' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Bavul', ARRAY['çanta', 'paket', 'giysi', 'bagaj'], 1, 'travel', 'tr');
    END IF;
    
    -- Macera
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Macera' AND category = 'travel' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Macera', ARRAY['yolculuk', 'keşfet', 'bul', 'heyecanlı'], 2, 'travel', 'tr');
    END IF;
    
    -- Sırt Çantası
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Sırt Çantası' AND category = 'travel' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Sırt Çantası', ARRAY['çanta', 'yürüyüş', 'seyahat', 'omuz'], 2, 'travel', 'tr');
    END IF;
    
    -- Seyahat Aşkı
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Seyahat Aşkı' AND category = 'travel' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Seyahat Aşkı', ARRAY['arzu', 'seyahat', 'gezin', 'keşfet'], 3, 'travel', 'tr');
    END IF;
END $$;

-- Adventure Kartları (Türkçe)
DO $$
BEGIN
    -- Dağ
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Dağ' AND category = 'adventure' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Dağ', ARRAY['zirve', 'tırman', 'yüksek', 'doruk'], 1, 'adventure', 'tr');
    END IF;
    
    -- Kamp
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Kamp' AND category = 'adventure' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Kamp', ARRAY['çadır', 'uyu', 'açık hava', 'ateş'], 1, 'adventure', 'tr');
    END IF;
    
    -- Yürüyüş
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Yürüyüş' AND category = 'adventure' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Yürüyüş', ARRAY['yürü', 'patika', 'dağ', 'bot'], 1, 'adventure', 'tr');
    END IF;
    
    -- Kaşif
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Kaşif' AND category = 'adventure' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Kaşif', ARRAY['maceraperest', 'keşfet', 'yolculuk', 'seyahat'], 2, 'adventure', 'tr');
    END IF;
    
    -- Keşif
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Keşif' AND category = 'adventure' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Keşif', ARRAY['yolculuk', 'görev', 'keşfet', 'macera'], 2, 'adventure', 'tr');
    END IF;
    
    -- Heyecan
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Heyecan' AND category = 'adventure' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Heyecan', ARRAY['coşku', 'adrenalin', 'hız', 'neşe'], 3, 'adventure', 'tr');
    END IF;
END $$;

-- Party Kartları (Türkçe)
DO $$
BEGIN
    -- Dans
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Dans' AND category = 'party' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Dans', ARRAY['müzik', 'hareket', 'ritim', 'oyun'], 1, 'party', 'tr');
    END IF;
    
    -- Kutlama
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Kutlama' AND category = 'party' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Kutlama', ARRAY['parti', 'festival', 'mutlu', 'sevinç'], 1, 'party', 'tr');
    END IF;
    
    -- Doğum Günü
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Doğum Günü' AND category = 'party' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Doğum Günü', ARRAY['pasta', 'mum', 'yaş', 'yıl'], 1, 'party', 'tr');
    END IF;
    
    -- Kokteyl
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Kokteyl' AND category = 'party' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Kokteyl', ARRAY['içecek', 'alkol', 'bar', 'karıştır'], 2, 'party', 'tr');
    END IF;
    
    -- Festival
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Festival' AND category = 'party' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Festival', ARRAY['kutlama', 'müzik', 'etkinlik', 'kalabalık'], 2, 'party', 'tr');
    END IF;
    
    -- Eğlence
    IF NOT EXISTS (SELECT 1 FROM game_cards WHERE word = 'Eğlence' AND category = 'party' AND language = 'tr') THEN
        INSERT INTO game_cards (word, forbidden_words, difficulty_level, category, language) 
        VALUES ('Eğlence', ARRAY['kutlama', 'neşeli', 'festival', 'sevinç'], 3, 'party', 'tr');
    END IF;
END $$;
