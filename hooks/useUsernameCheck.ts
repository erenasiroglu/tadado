import { UserService } from '@/services/userService';
import { useState } from 'react';

/**
 * Hook for checking username availability
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
