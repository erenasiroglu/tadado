import { supabase } from '@/lib/supabase';
import { CreateUserData, UpdateUserData, User } from '@/types/user';

export class UserService {
  
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Kullanıcı getirme hatası:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return null;
    }
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Kullanıcı getirme hatası:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return null;
    }
  }

  static async getAllUsers(page: number = 0, limit: number = 20): Promise<User[]> {
    try {
      const start = page * limit;
      const end = start + limit - 1;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) {
        console.error('Kullanıcıları getirme hatası:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return [];
    }
  }


  static async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userData.id,
          username: userData.username,
          avatar_url: userData.avatar_url || null,
          language: userData.language || 'en',
          is_adult: userData.is_adult || false,
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Kullanıcı oluşturma hatası:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return null;
    }
  }

  static async updateUser(userId: string, updateData: UpdateUserData): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Kullanıcı güncelleme hatası:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return null;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Kullanıcı silme hatası:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return false;
    }
  }


  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      return !data;
    } catch (error) {
      return true;
    }
  }

  static async getPremiumUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_premium', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Premium kullanıcıları getirme hatası:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return [];
    }
  }

  static async getUserCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Kullanıcı sayısı getirme hatası:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      return 0;
    }
  }
}