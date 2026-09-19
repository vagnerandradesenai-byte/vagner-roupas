import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
        <div className="relative mb-5 animate-pulse">
          <img 
            src="/logo.png?v=2" 
            alt="Atleta Fashion" 
            className="h-28 w-auto object-contain mx-auto drop-shadow-[0_10px_25px_rgba(6,182,212,0.3)]"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <span>Carregando Atleta Fashion...</span>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
