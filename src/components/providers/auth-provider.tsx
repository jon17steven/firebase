'use client';

import React, { createContext, useContext } from 'react';
import { useAuth as useAuthListener } from '@/hooks/use-auth-listener';
import type { User } from '@/types';
// Firebase specific functions (login, logout, signup) would be imported here if not mocked
import { auth as firebaseAuth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<any>;
  signup: (email?: string, password?: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthListener();
  const { toast } = useToast();

  // These would call actual Firebase functions
  const login = async (email?: string, password?: string) => {
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email || '', password || '');
      toast({ title: "Inicio de sesión exitoso", description: "Bienvenido de nuevo!" });
      return result;
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({ title: "Error al iniciar sesión", description: error.message || "Por favor, inténtalo de nuevo.", variant: "destructive" });
      throw error;
    }
  };

  const signup = async (email?: string, password?: string) => {
     try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email || '', password || '');
      toast({ title: "Registro exitoso", description: "Tu cuenta ha sido creada." });
      return result;
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast({ title: "Error en el registro", description: error.message || "Por favor, inténtalo de nuevo.", variant: "destructive" });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      toast({ title: "Cierre de sesión exitoso" });
    } catch (error: any)
    {
      console.error("Logout failed:", error);
      toast({ title: "Error al cerrar sesión", description: error.message || "Por favor, inténtalo de nuevo.", variant: "destructive"});
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
