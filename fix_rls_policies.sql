-- Fix RLS Policies for Teams Table
-- Bu dosya teams tablosu için eksik RLS policy'lerini ekler

-- Teams tablosu için INSERT policy'si ekle
CREATE POLICY "Users can create teams in their game sessions" ON teams
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM game_sessions 
            WHERE game_sessions.id = teams.game_session_id 
            AND game_sessions.host_user_id = auth.uid()
        )
    );

-- Teams tablosu için UPDATE policy'si ekle
CREATE POLICY "Users can update teams in their game sessions" ON teams
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM game_sessions 
            WHERE game_sessions.id = teams.game_session_id 
            AND game_sessions.host_user_id = auth.uid()
        )
    );
