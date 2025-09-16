import { supabase } from '@/lib/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface GameCard {
  id: string;
  word: string;
  forbiddenWords: string[];
  difficulty: number;
  category?: string;
  language: string;
}

export interface Team {
  id: string;
  name: string;
  players: string[];
  score: number;
}

export interface GameSettings {
  deckLanguage: string;
  roundDuration: number;
  totalRounds: number;
  passLimit: number;
  allowPass: boolean;
}

export interface GameSession {
  id: string;
  hostUserId: string;
  gameModeId: string;
  sessionName: string;
  settings: GameSettings;
  teams: Team[];
  currentRound: number;
  currentTeam: number;
  status: 'waiting' | 'playing' | 'finished' | 'cancelled';
  winnerTeamId?: string;
  totalScoreTeam1: number;
  totalScoreTeam2: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface RoundResult {
  roundNumber: number;
  teamId: string;
  cardsGuessed: number;
  cardsPassed: number;
  cardsFailed: number;
  roundScore: number;
  roundDuration: number;
  startedAt: string;
  finishedAt: string;
}

interface GameContextType {
  // Game State
  currentSession: GameSession | null;
  currentCard: GameCard | null;
  gameCards: GameCard[];
  timeLeft: number;
  isPaused: boolean;
  cardsGuessed: number;
  cardsPassed: number;
  cardsFailed: number;
  currentStreak: number;
  bestStreak: number;
  
  // Game Actions
  createGameSession: (settings: GameSettings, teams: Team[]) => Promise<{ success: boolean; error?: string }>;
  startGame: () => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => Promise<void>;
  nextCard: () => void;
  handleCardAction: (action: 'correct' | 'pass' | 'skip') => void;
  switchTeam: () => void;
  nextRound: () => void;
  
  // Card Management
  loadGameCards: (language: string, category?: string) => Promise<void>;
  shuffleCards: () => void;
  
  // Statistics
  updateStatistics: (userId: string, result: RoundResult) => Promise<void>;
  getGameStatistics: (userId: string) => Promise<any>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsGuessed, setCardsGuessed] = useState(0);
  const [cardsPassed, setCardsPassed] = useState(0);
  const [cardsFailed, setCardsFailed] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isPaused && currentSession?.status === 'playing') {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentSession?.status === 'playing') {
      handleRoundEnd();
    }
  }, [timeLeft, isPaused, currentSession?.status]);

  const createGameSession = async (settings: GameSettings, teams: Team[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // First, get the team mode ID from game_modes table
      console.log('Getting game mode ID...');
      const { data: gameMode, error: modeError } = await supabase
        .from('game_modes')
        .select('id')
        .eq('name', 'Team Mode')
        .single();

      if (modeError || !gameMode) {
        console.error('Error getting game mode:', modeError);
        return { success: false, error: 'Game mode not found' };
      }

      console.log('Game mode ID found:', gameMode.id);

      console.log('Creating game session...');
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          host_user_id: user.id,
          game_mode_id: gameMode.id, // Use the actual UUID
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

      if (error) {
        console.error('Error creating game session:', error);
        return { success: false, error: error.message };
      }

      console.log('Game session created:', data.id);

      // Create teams
      const teamInserts = teams.map((team, index) => ({
        game_session_id: data.id,
        team_name: team.name,
        team_number: index + 1,
        score: 0,
      }));

      const { error: teamError } = await supabase
        .from('teams')
        .insert(teamInserts);

      if (teamError) {
        return { success: false, error: teamError.message };
      }

      const gameSession: GameSession = {
        id: data.id,
        hostUserId: user.id,
        gameModeId: gameMode.id,
        sessionName: data.session_name,
        settings,
        teams,
        currentRound: 1,
        currentTeam: 1,
        status: 'waiting',
        totalScoreTeam1: 0,
        totalScoreTeam2: 0,
        createdAt: data.created_at,
      };

      setCurrentSession(gameSession);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to create game session' };
    }
  };

  const startGame = async () => {
    if (!currentSession) return;

    try {
      // Update session status
      const { error } = await supabase
        .from('game_sessions')
        .update({
          status: 'playing',
          started_at: new Date().toISOString(),
        })
        .eq('id', currentSession.id);

      if (error) {
        console.error('Error starting game:', error);
        return;
      }

      setCurrentSession(prev => prev ? { ...prev, status: 'playing', startedAt: new Date().toISOString() } : null);
      setTimeLeft(currentSession.settings.roundDuration);
      setCardsGuessed(0);
      setCardsPassed(0);
      setCardsFailed(0);
      setCurrentStreak(0);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const pauseGame = () => {
    setIsPaused(true);
  };

  const resumeGame = () => {
    setIsPaused(false);
  };

  const endGame = async () => {
    if (!currentSession) return;

    try {
      const winner = currentSession.totalScoreTeam1 > currentSession.totalScoreTeam2 ? 1 : 2;
      
      const { error } = await supabase
        .from('game_sessions')
        .update({
          status: 'finished',
          finished_at: new Date().toISOString(),
          winner_team_id: winner,
        })
        .eq('id', currentSession.id);

      if (error) {
        console.error('Error ending game:', error);
        return;
      }

      setCurrentSession(prev => prev ? { 
        ...prev, 
        status: 'finished', 
        finishedAt: new Date().toISOString(),
        winnerTeamId: winner.toString()
      } : null);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const nextCard = () => {
    if (gameCards.length === 0) return;
    
    const currentIndex = gameCards.findIndex(card => card.id === currentCard?.id);
    const nextIndex = (currentIndex + 1) % gameCards.length;
    setCurrentCard(gameCards[nextIndex]);
  };

  const handleCardAction = (action: 'correct' | 'pass' | 'skip') => {
    if (!currentSession) return;

    if (action === 'correct') {
      setCardsGuessed(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, currentStreak + 1));
      
      // Update team score
      const teamIndex = currentSession.currentTeam - 1;
      const updatedTeams = [...currentSession.teams];
      updatedTeams[teamIndex].score += 1;
      
      setCurrentSession(prev => prev ? {
        ...prev,
        teams: updatedTeams,
        totalScoreTeam1: teamIndex === 0 ? prev.totalScoreTeam1 + 1 : prev.totalScoreTeam1,
        totalScoreTeam2: teamIndex === 1 ? prev.totalScoreTeam2 + 1 : prev.totalScoreTeam2,
      } : null);
    } else if (action === 'pass') {
      setCardsPassed(prev => prev + 1);
      setCurrentStreak(0);
    } else if (action === 'skip') {
      setCardsFailed(prev => prev + 1);
      setCurrentStreak(0);
    }

    nextCard();
  };

  const switchTeam = () => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? {
      ...prev,
      currentTeam: prev.currentTeam === 1 ? 2 : 1,
    } : null);
  };

  const nextRound = () => {
    if (!currentSession) return;
    
    if (currentSession.currentRound < currentSession.settings.totalRounds) {
      setCurrentSession(prev => prev ? {
        ...prev,
        currentRound: prev.currentRound + 1,
        currentTeam: prev.currentTeam === 1 ? 2 : 1,
      } : null);
      setTimeLeft(currentSession.settings.roundDuration);
      setCardsGuessed(0);
      setCardsPassed(0);
      setCardsFailed(0);
      setCurrentStreak(0);
    } else {
      endGame();
    }
  };

  const loadGameCards = async (language: string, category?: string) => {
    try {
      console.log('Loading game cards for language:', language, 'category:', category);
      
      let query = supabase
        .from('game_cards')
        .select('*')
        .eq('language', language)
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error loading game cards:', error);
        return;
      }

      console.log('Loaded game cards:', data?.length || 0);

      const cards: GameCard[] = data.map(card => ({
        id: card.id,
        word: card.word,
        forbiddenWords: card.forbidden_words,
        difficulty: card.difficulty_level,
        category: card.category,
        language: card.language,
      }));

      setGameCards(cards);
      if (cards.length > 0) {
        setCurrentCard(cards[0]);
        console.log('Set current card:', cards[0].word);
      } else {
        console.log('No cards found for the given criteria');
      }
    } catch (error) {
      console.error('Error loading game cards:', error);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
    if (shuffled.length > 0) {
      setCurrentCard(shuffled[0]);
    }
  };

  const updateStatistics = async (userId: string, result: RoundResult) => {
    try {
      // Update game statistics
      const { error } = await supabase
        .from('game_statistics')
        .upsert({
          user_id: userId,
          total_games_played: 1,
          total_cards_guessed: result.cardsGuessed,
          total_cards_passed: result.cardsPassed,
          total_cards_failed: result.cardsFailed,
          average_score_per_game: result.roundScore,
          best_score: result.roundScore,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating statistics:', error);
      }
    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  };

  const getGameStatistics = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('game_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error getting statistics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting statistics:', error);
      return null;
    }
  };

  const handleRoundEnd = () => {
    if (!currentSession) return;
    
    // Save round result
    const roundResult: RoundResult = {
      roundNumber: currentSession.currentRound,
      teamId: currentSession.teams[currentSession.currentTeam - 1].id,
      cardsGuessed,
      cardsPassed,
      cardsFailed,
      roundScore: cardsGuessed,
      roundDuration: currentSession.settings.roundDuration - timeLeft,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
    };

    // Update statistics
    updateStatistics(currentSession.hostUserId, roundResult);
    
    // Move to next round or end game
    nextRound();
  };

  const value: GameContextType = {
    currentSession,
    currentCard,
    gameCards,
    timeLeft,
    isPaused,
    cardsGuessed,
    cardsPassed,
    cardsFailed,
    currentStreak,
    bestStreak,
    createGameSession,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    nextCard,
    handleCardAction,
    switchTeam,
    nextRound,
    loadGameCards,
    shuffleCards,
    updateStatistics,
    getGameStatistics,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
