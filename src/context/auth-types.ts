import { createContext } from 'react';
import type { Vendedor, CargoVendedor } from '../types';

export interface AuthContextType {
  user: Vendedor | null;
  loading: boolean;
  error: string | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (dados: {
    nome: string;
    email: string;
    telefone?: string;
    cargo: CargoVendedor;
    senha: string;
  }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
