import { GameCard, GameSession, GameSettings, RoundResult, Team } from '@/contexts/GameContext';
import { supabase } from '@/lib/supabase';

export class GameService {
  // Game Cards
  static async getGameCards(language: string, category?: string, difficulty?: number): Promise<GameCard[]> {
    try {
      let query = supabase
        .from('game_cards')
        .select('*')
        .eq('language', language)
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      if (difficulty) {
        query = query.eq('difficulty_level', difficulty);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data.map(card => ({
        id: card.id,
        word: card.word,
        forbiddenWords: card.forbidden_words,
        difficulty: card.difficulty_level,
        category: card.category,
        language: card.language,
      }));
    } catch (error) {
      console.error('Error fetching game cards:', error);
      throw error;
    }
  }

  static async addGameCard(card: Omit<GameCard, 'id'>): Promise<GameCard> {
    try {
      const { data, error } = await supabase
        .from('game_cards')
        .insert({
          word: card.word,
          forbidden_words: card.forbiddenWords,
          difficulty_level: card.difficulty,
          category: card.category,
          language: card.language,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        word: data.word,
        forbiddenWords: data.forbidden_words,
        difficulty: data.difficulty_level,
        category: data.category,
        language: data.language,
      };
    } catch (error) {
      console.error('Error adding game card:', error);
      throw error;
    }
  }

  // Game Sessions
  static async createGameSession(
    hostUserId: string,
    settings: GameSettings,
    teams: Team[]
  ): Promise<GameSession> {
    try {
      // Create game session
      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          host_user_id: hostUserId,
          game_mode_id: 'team-mode',
          session_name: `Game ${new Date().toLocaleString()}`,
          deck_language: settings.deckLanguage,
          round_duration: settings.roundDuration,
          total_rounds: settings.totalRounds,
          pass_limit: settings.passLimit,
          status: 'waiting',
          total_score_team1: 0,
          total_score_team2: 0,
        })
        .select()
        .single();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      // Create teams
      const teamInserts = teams.map((team, index) => ({
        game_session_id: sessionData.id,
        team_name: team.name,
        team_number: index + 1,
        score: 0,
      }));

      const { error: teamError } = await supabase
        .from('teams')
        .insert(teamInserts);

      if (teamError) {
        throw new Error(teamError.message);
      }

      return {
        id: sessionData.id,
        hostUserId: sessionData.host_user_id,
        gameModeId: sessionData.game_mode_id,
        sessionName: sessionData.session_name,
        settings,
        teams,
        currentRound: 1,
        currentTeam: 1,
        status: 'waiting',
        totalScoreTeam1: 0,
        totalScoreTeam2: 0,
        createdAt: sessionData.created_at,
      };
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  static async getGameSession(sessionId: string): Promise<GameSession | null> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          *,
          teams (*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) return null;

      return {
        id: data.id,
        hostUserId: data.host_user_id,
        gameModeId: data.game_mode_id,
        sessionName: data.session_name,
        settings: {
          deckLanguage: data.deck_language,
          roundDuration: data.round_duration,
          totalRounds: data.total_rounds,
          passLimit: data.pass_limit,
          allowPass: data.pass_limit > 0,
        },
        teams: data.teams.map((team: any) => ({
          id: team.id,
          name: team.team_name,
          players: [], // Will be loaded separately
          score: team.score,
        })),
        currentRound: data.current_round,
        currentTeam: data.current_team_turn,
        status: data.status,
        winnerTeamId: data.winner_team_id,
        totalScoreTeam1: data.total_score_team1,
        totalScoreTeam2: data.total_score_team2,
        createdAt: data.created_at,
        startedAt: data.started_at,
        finishedAt: data.finished_at,
      };
    } catch (error) {
      console.error('Error fetching game session:', error);
      throw error;
    }
  }

  static async updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.currentRound !== undefined) updateData.current_round = updates.currentRound;
      if (updates.currentTeam !== undefined) updateData.current_team_turn = updates.currentTeam;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.totalScoreTeam1 !== undefined) updateData.total_score_team1 = updates.totalScoreTeam1;
      if (updates.totalScoreTeam2 !== undefined) updateData.total_score_team2 = updates.totalScoreTeam2;
      if (updates.winnerTeamId !== undefined) updateData.winner_team_id = updates.winnerTeamId;
      if (updates.startedAt !== undefined) updateData.started_at = updates.startedAt;
      if (updates.finishedAt !== undefined) updateData.finished_at = updates.finishedAt;

      const { error } = await supabase
        .from('game_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error updating game session:', error);
      throw error;
    }
  }

  // Round Results
  static async saveRoundResult(sessionId: string, result: RoundResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('round_results')
        .insert({
          game_session_id: sessionId,
          round_number: result.roundNumber,
          team_id: result.teamId,
          cards_guessed: result.cardsGuessed,
          cards_passed: result.cardsPassed,
          cards_failed: result.cardsFailed,
          round_score: result.roundScore,
          round_duration: result.roundDuration,
          started_at: result.startedAt,
          finished_at: result.finishedAt,
        });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error saving round result:', error);
      throw error;
    }
  }

  // Game Statistics
  static async updateGameStatistics(userId: string, stats: {
    gamesPlayed?: number;
    gamesWon?: number;
    cardsGuessed?: number;
    cardsPassed?: number;
    cardsFailed?: number;
    averageScore?: number;
    bestScore?: number;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('game_statistics')
        .upsert({
          user_id: userId,
          total_games_played: stats.gamesPlayed || 0,
          total_games_won: stats.gamesWon || 0,
          total_cards_guessed: stats.cardsGuessed || 0,
          total_cards_passed: stats.cardsPassed || 0,
          total_cards_failed: stats.cardsFailed || 0,
          average_score_per_game: stats.averageScore || 0,
          best_score: stats.bestScore || 0,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error updating game statistics:', error);
      throw error;
    }
  }

  static async getGameStatistics(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('game_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching game statistics:', error);
      throw error;
    }
  }

  // Game Modes
  static async getGameModes(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('game_modes')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching game modes:', error);
      throw error;
    }
  }

  // Utility functions
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  static getDifficultyColor(level: number): string {
    switch (level) {
      case 1: return '#4CAF50'; // Easy - Green
      case 2: return '#FF9800'; // Medium - Orange
      case 3: return '#F44336'; // Hard - Red
      default: return '#4CAF50';
    }
  }

  static getDifficultyText(level: number): string {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Easy';
    }
  }
}
