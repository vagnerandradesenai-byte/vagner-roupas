import React, { useState, useEffect } from 'react';
import type { Vendedor, CargoVendedor } from '../types';
import { autenticarVendedor, cadastrarVendedor } from '../lib/neon';
import { AuthContext } from './auth-types';

const STORAGE_KEY = 'vagner_roupas_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Vendedor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sessão persistida
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Erro ao ler sessão local:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const vendedor = await autenticarVendedor(email, senha);
      setUser(vendedor);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vendedor));
      return true;
    } catch (err: any) {
      setError(err?.message || 'Falha ao realizar login. Verifique seus dados.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (dados: {
    nome: string;
    email: string;
    telefone?: string;
    cargo: CargoVendedor;
    senha: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const vendedor = await cadastrarVendedor(dados);
      setUser(vendedor);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vendedor));
      return true;
    } catch (err: any) {
      setError(err?.message || 'Falha ao criar conta. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
