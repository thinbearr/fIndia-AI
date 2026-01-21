/**
 * Authentication Context
 * Manages user authentication state
 */

import React, { createContext, useContext, useState } from 'react';

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
    const [user] = useState<User | null>({
        id: 'public-user',
        email: 'public@findia.ai',
        name: 'Guest User'
    });

    // No real auth needed for public version
    const loginWithGoogle = async () => { console.log('Public mode'); };
    const loginWithEmail = async () => { console.log('Public mode'); };
    const signupWithEmail = async () => { console.log('Public mode'); };
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
