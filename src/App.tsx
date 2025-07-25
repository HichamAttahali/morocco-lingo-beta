import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import LanguageSelection from './components/LanguageSelection';
import LevelSelection from './components/LevelSelection';
import LessonInterface from './components/LessonInterface';
import UserProfile from './components/UserProfile';
import { UserData, Language } from './types';
import { saveUserData, loadUserData, playSound } from './utils/storage';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'languages' | 'levels' | 'lesson' | 'profile'>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [userData, setUserData] = useState<UserData>({
    totalXP: 0,
    languageProgress: {},
    achievements: [],
    streak: 0,
    lastStudyDate: null,
    level: 1,
    hearts: 5
  });

  const { darkMode, toggleDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const saved = loadUserData(user.username);
      if (saved) {
        setUserData(saved);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      saveUserData(user.username, userData);
    }
  }, [userData, isAuthenticated, user]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentView('levels');
  };

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);
    setCurrentView('lesson');
  };

  const handleLessonComplete = (xpGained: number, isCorrect: boolean) => {
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('incorrect');
    }

    const today = new Date().toDateString();
    const lastStudy = userData.lastStudyDate;
    let newStreak = userData.streak;

    if (lastStudy !== today) {
      if (lastStudy === new Date(Date.now() - 86400000).toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    setUserData(prev => ({
      ...prev,
      totalXP: prev.totalXP + xpGained,
      streak: newStreak,
      lastStudyDate: today,
      languageProgress: {
        ...prev.languageProgress,
        [selectedLanguage?.code || '']: {
          ...prev.languageProgress[selectedLanguage?.code || ''],
          unlockedLevels: Math.max(
            prev.languageProgress[selectedLanguage?.code || '']?.unlockedLevels || 1,
            selectedLevel + 1
          ),
          xp: (prev.languageProgress[selectedLanguage?.code || '']?.xp || 0) + xpGained
        }
      }
    }));
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedLanguage(null);
    setSelectedLevel(0);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-gray-200'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="text-2xl font-bold text-green-500 hover:text-green-600 transition-colors"
              >
                Morocco Lingo
              </button>
              {userData.streak > 0 && (
                <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded-full">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">🔥</span>
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">{userData.streak}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{userData.totalXP} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">❤️</span>
                  <span className="font-semibold">{userData.hearts}</span>
                </div>
              </div>
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setCurrentView('profile')}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage 
            userData={userData}
            onStartLearning={() => setCurrentView('languages')}
            onViewProfile={() => setCurrentView('profile')}
          />
        )}
        
        {currentView === 'languages' && (
          <LanguageSelection 
            onLanguageSelect={handleLanguageSelect}
            onBack={handleBackToHome}
            userData={userData}
          />
        )}
        
        {currentView === 'levels' && selectedLanguage && (
          <LevelSelection
            language={selectedLanguage}
            userData={userData}
            onLevelSelect={handleLevelSelect}
            onBack={() => setCurrentView('languages')}
          />
        )}
        
        {currentView === 'lesson' && selectedLanguage && (
          <LessonInterface
            language={selectedLanguage}
            level={selectedLevel}
            userData={userData}
            onComplete={handleLessonComplete}
            onBack={() => setCurrentView('levels')}
          />
        )}
        
        {currentView === 'profile' && (
          <UserProfile
            userData={userData}
            onBack={handleBackToHome}
            user={user}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl font-bold text-green-500">Morocco Lingo</span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                - Apprenez les langues en vous amusant
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © {new Date().getFullYear()} Morocco Lingo. Tous droits réservés.
              </p>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Développé par <span className="text-green-500">Hicham Attahali</span>
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-center md:justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <div className="flex space-x-4 mb-2 md:mb-0">
                <span>🌟 Application d'apprentissage de langues</span>
                <span>🚀 Interface moderne et intuitive</span>
                <span>🎯 Progression gamifiée</span>
              </div>
              <div>
                Version 1.0.0 - Made with ❤️ in Morocco
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;