import { UserService } from '@/services/userService';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';

export function useUsers(page: number = 0, limit: number = 20) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [page, limit]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await UserService.getAllUsers(page, limit);
      
      if (page === 0) {
        setUsers(userData);
      } else {
        setUsers(prev => [...prev, ...userData]);
      }
      
      setHasMore(userData.length === limit);
    } catch (err) {
      setError('Kullanıcılar yüklenirken hata oluştu');
      console.error('Kullanıcı yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadUsers();
  };

  return {
    users,
    loading,
    error,
    hasMore,
    refresh,
  };
}

/**
 * Tek kullanıcı için hook
 */
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await UserService.getUserById(userId);
      setUser(userData);
    } catch (err) {
      setError('Kullanıcı yüklenirken hata oluştu');
      console.error('Kullanıcı yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadUser();
  };

  return {
    user,
    loading,
    error,
    refresh,
  };
}

/**
 * Username kullanılabilirliği için hook
 */
export function useUsernameCheck() {
  const [isChecking, setIsChecking] = useState(false);

  const checkUsername = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) {
      return false;
    }

    try {
      setIsChecking(true);
      const isAvailable = await UserService.isUsernameAvailable(username);
      return isAvailable;
    } catch (error) {
      console.error('Username kontrol hatası:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkUsername,
    isChecking,
  };
}