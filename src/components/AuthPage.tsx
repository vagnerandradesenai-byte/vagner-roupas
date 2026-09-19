import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import type { CargoVendedor } from '../types';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Briefcase, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, error, clearError, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState<CargoVendedor>('vendedor');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (isLoginMode) {
      if (!email || !password) {
        setFormError('Por favor, informe seu email e sua senha.');
        return;
      }
      await login(email, password);
    } else {
      // Validações do Cadastro
      if (!nome.trim()) {
        setFormError('Por favor, digite seu nome completo.');
        return;
      }
      if (!email.trim()) {
        setFormError('Por favor, informe um endereço de email válido.');
        return;
      }
      if (password.length < 6) {
        setFormError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('As senhas digitadas não coincidem.');
        return;
      }

      await register({
        nome,
        email,
        telefone,
        cargo,
        senha: password
      });
    }
  };

  const switchMode = (mode: boolean) => {
    setIsLoginMode(mode);
    setFormError(null);
    clearError();
  };

  // Cálculo simples de força da senha
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-slate-950/40 backdrop-blur-[2px]">
      {/* Luzes de fundo decorativas */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] z-10">
        
        {/* Logo e Cabeçalho da Marca */}
        <div className="text-center mb-6">
          <div className="inline-block relative group mb-3">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-400 rounded-3xl blur-md opacity-35 group-hover:opacity-55 transition duration-300 pointer-events-none" />
            <div className="relative rounded-2xl p-2 bg-[#0b1120]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md">
              <img 
                src="/logo.png?v=2" 
                alt="Atleta Fashion — Vagner Roupas" 
                className="h-28 sm:h-32 w-auto object-contain mx-auto rounded-xl"
              />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Atleta Fashion
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold tracking-wider">
              VAGNER ROUPAS
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sistema de Gestão Comercial, PDV & Controle de Estoque
          </p>
        </div>

        {/* Card Principal de Autenticação */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
          
          {/* Seletor de Modo (Abas) */}
          <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isLoginMode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                !isLoginMode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cadastre-se
            </button>
          </div>

          {/* Alertas de Erro */}
          {(formError || error) && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                {formError || error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* CAMPOS ESPECÍFICOS DE CADASTRO */}
            {!isLoginMode && (
              <>
                {/* Nome Completo */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Telefone / WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Cargo / Função */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Cargo / Função
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value as CargoVendedor)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="vendedor" className="bg-slate-900 text-white">Vendedor(a)</option>
                      <option value="gerente" className="bg-slate-900 text-white">Gerente de Loja</option>
                      <option value="caixa" className="bg-slate-900 text-white">Operador(a) de Caixa</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email (comum para login e cadastro) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendedor@vagnerroupas.com.br"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Indicador de força da senha no cadastro */}
              {!isLoginMode && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-rose-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-amber-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 rounded-full ${strength >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {strength < 2 ? 'Senha fraca (mínimo 6 caracteres)' : strength < 4 ? 'Senha razoável' : 'Senha forte'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmar Senha (apenas cadastro) */}
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-400 mt-1">As senhas não coincidem.</p>
                )}
              </div>
            )}

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isLoginMode ? (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Criar Conta</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Rodapé do Card com Alternância */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            {isLoginMode ? (
              <p className="text-xs text-slate-400">
                Não tem uma conta de vendedor?{' '}
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2"
                >
                  Cadastre-se aqui
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Já possui acesso cadastrado?{' '}
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2"
                >
                  Faça login
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Rodapé de Segurança e Status Neon */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Banco Neon Conectado (`vagner_roupas`)</span>
          <span>•</span>
          <span>Row Level Security Ativo</span>
        </div>

      </div>
    </div>
  );
};
