/**
 * Authentication Context
 * Manages user authentication state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleAuth, emailLogin, emailSignup, getCurrentUser } from './api';

interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    auth_provider?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginWithGoogle: (credential: string) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>({
        id: 'public-user',
        email: 'public@findia.ai',
        name: 'Guest User'
    });
    const [isLoading, setIsLoading] = useState(false);

    // No real auth needed for public version
    const loginWithGoogle = async (credential: string) => { console.log('Public mode'); };
    const loginWithEmail = async (email: string, password: string) => { console.log('Public mode'); };
    const signupWithEmail = async (name: string, email: string, password: string) => { console.log('Public mode'); };
    const logout = () => { console.log('Logout disabled in public mode'); };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: true,
            isLoading: false,
            loginWithGoogle,
            loginWithEmail,
            signupWithEmail,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
