export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  language: string;
  is_adult: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  id: string;
  username: string;
  avatar_url?: string;
  language?: string;
  is_adult?: boolean;
}

export interface UpdateUserData {
  username?: string;
  avatar_url?: string;
  language?: string;
  is_adult?: boolean;
  is_premium?: boolean;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: any;
}