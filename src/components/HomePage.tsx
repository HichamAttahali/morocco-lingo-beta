import React from 'react';
import { Play, Trophy, Flame, Target } from 'lucide-react';
import { UserData } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface HomePageProps {
  userData: UserData;
  onStartLearning: () => void;
  onViewProfile: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ userData, onStartLearning, onViewProfile }) => {
  const { darkMode } = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  const getXPForNextLevel = (xp: number) => {
    const currentLevel = calculateLevel(xp);
    return currentLevel * 1000 - xp;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-8 mb-8 ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
          : 'bg-gradient-to-r from-green-500 to-blue-600'
      } text-white`}>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()} ! 👋
            </h1>
            <p className="text-xl opacity-90">
              Prêt à apprendre quelque chose de nouveau aujourd'hui ?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStartLearning}
              className="flex items-center space-x-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              <Play className="w-5 h-5" />
              <span>Commencer à apprendre</span>
            </button>
            
            <button
              onClick={onViewProfile}
              className="flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              <Trophy className="w-5 h-5" />
              <span>Mon profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total XP */}
        <div className={`rounded-xl p-6 shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {userData.totalXP}
            </span>
          </div>
          <h3 className="font-semibold mb-1">Points d'expérience</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Niveau {calculateLevel(userData.totalXP)}
          </p>
        </div>

        {/* Streak */}
        <div className={`rounded-xl p-6 shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {userData.streak}
            </span>
          </div>
          <h3 className="font-semibold mb-1">Série</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {userData.streak > 0 ? 'jours consécutifs' : 'Commencez aujourd\'hui !'}
          </p>
        </div>

        {/* Languages */}
        <div className={`rounded-xl p-6 shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Object.keys(userData.languageProgress).length}
            </span>
          </div>
          <h3 className="font-semibold mb-1">Langues</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            en cours d'apprentissage
          </p>
        </div>

        {/* Hearts */}
        <div className={`rounded-xl p-6 shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <span className="text-2xl">❤️</span>
            </div>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              {userData.hearts}
            </span>
          </div>
          <h3 className="font-semibold mb-1">Vies</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {userData.hearts > 0 ? 'Prêt à apprendre' : 'Récupération...'}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className={`rounded-xl p-6 shadow-lg mb-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className="text-xl font-bold mb-4">Progression actuelle</h2>
        
        {Object.keys(userData.languageProgress).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(userData.languageProgress).map(([langCode, progress]) => (
              <div key={langCode} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {langCode.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{langCode === 'en' ? 'Anglais' : langCode === 'es' ? 'Espagnol' : langCode === 'fr' ? 'Français' : 'Langue'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Niveau {progress.unlockedLevels - 1} • {progress.xp} XP
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (progress.xp % 1000) / 10)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {getXPForNextLevel(progress.xp)} XP pour le niveau suivant
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Commencez votre aventure !</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Choisissez une langue et commencez à apprendre dès maintenant.
            </p>
            <button
              onClick={onStartLearning}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200"
            >
              Choisir une langue
            </button>
          </div>
        )}
      </div>

      {/* Daily Goal */}
      <div className={`rounded-xl p-6 shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className="text-xl font-bold mb-4">Objectif quotidien</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Restez motivé !</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Objectif : 50 XP par jour
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (userData.totalXP % 50) * 2)}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold">
              {userData.totalXP % 50}/50 XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;