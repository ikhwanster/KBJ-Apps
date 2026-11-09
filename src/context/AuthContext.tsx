import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../utils/initialData';

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  isLoginModalOpen: boolean;
  pendingUser: UserProfile | null;
  totpCode: string;
  loginError: string | null;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  initiateLogin: (user: UserProfile) => void;
  verify2FA: (code: string) => boolean;
  logout: () => void;
  switchRoleDirectly: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sijentik_auth_user_v1';
const TWO_FA_STORAGE_KEY = 'sijentik_auth_2fa_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Kader Jumantik for an immediate rich field inspection experience
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [totpCode, setTotpCode] = useState<string>('482910'); // Demo valid TOTP
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const saved2FA = localStorage.getItem(TWO_FA_STORAGE_KEY);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        setIs2FAVerified(saved2FA === 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openLoginModal = () => {
    setLoginError(null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setPendingUser(null);
    setLoginError(null);
  };

  const initiateLogin = (user: UserProfile) => {
    if (user.is2FAEnabled) {
      setPendingUser(user);
      setTotpCode(Math.floor(100000 + Math.random() * 900000).toString());
    } else {
      // Direct login without 2FA
      completeLogin(user, true);
    }
  };

  const verify2FA = (enteredCode: string): boolean => {
    // Valid if matches generated code or default fallback demo code
    if (enteredCode === totpCode || enteredCode === '482910' || enteredCode === '123456') {
      if (pendingUser) {
        completeLogin(pendingUser, true);
      }
      return true;
    } else {
      setLoginError('Kode 2FA tidak valid. Gunakan kode 6-digit yang tertera.');
      return false;
    }
  };

  const completeLogin = (user: UserProfile, twoFaStatus: boolean) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIs2FAVerified(twoFaStatus);
    setPendingUser(null);
    setIsLoginModalOpen(false);
    setLoginError(null);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TWO_FA_STORAGE_KEY, String(twoFaStatus));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    // Fall back to resident / guest view
    const guest = INITIAL_USERS.find((u) => u.role === 'warga') || INITIAL_USERS[3];
    setCurrentUser(guest);
    setIsAuthenticated(false);
    setIs2FAVerified(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TWO_FA_STORAGE_KEY);
  };

  const switchRoleDirectly = (role: UserRole) => {
    const target = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(target);
    setIsAuthenticated(true);
    setIs2FAVerified(target.is2FAEnabled);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(target));
      localStorage.setItem(TWO_FA_STORAGE_KEY, String(target.is2FAEnabled));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        is2FAVerified,
        isLoginModalOpen,
        pendingUser,
        totpCode,
        loginError,
        openLoginModal,
        closeLoginModal,
        initiateLogin,
        verify2FA,
        logout,
        switchRoleDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
