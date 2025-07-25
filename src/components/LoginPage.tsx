import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username.length < 3 || password.length < 6) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères et le mot de passe au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      let success;
      if (isLogin) {
        success = await login(username, password);
        if (!success) {
          setError('Nom d\'utilisateur ou mot de passe incorrect');
        }
      } else {
        success = await register(username, password);
        if (!success) {
          setError('Ce nom d\'utilisateur existe déjà');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Morocco Lingo</h1>
          <p className="text-white/80">Apprenez les langues en vous amusant</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Connectez-vous pour continuer' : 'Créez votre compte'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Chargement...
                </div>
              ) : (
                isLogin ? 'Se connecter' : 'S\'inscrire'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 text-green-600 hover:text-green-700 font-semibold"
              >
                {isLogin ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Account */}
        <div className="text-center mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white/80 text-sm mb-2">Compte de démonstration :</p>
          <p className="text-white text-sm">
            <strong>Utilisateur :</strong> demo | <strong>Mot de passe :</strong> demo123
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Morocco Lingo - Développé par <span className="text-white font-semibold">Hicham Attahali</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;