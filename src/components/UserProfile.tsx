import React from 'react';
import { ArrowLeft, Trophy, Star, Flame, Calendar, Award, Target, TrendingUp, LogOut } from 'lucide-react';
import { UserData, User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  userData: UserData;
  onBack: () => void;
  user: User | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, onBack, user }) => {
  const { darkMode } = useTheme();
  const { logout } = useAuth();

  const calculateLevel = (xp: number) => Math.floor(xp / 1000) + 1;
  const getXPForNextLevel = (xp: number) => {
    const currentLevel = calculateLevel(xp);
    return currentLevel * 1000 - xp;
  };

  const totalLanguages = Object.keys(userData.languageProgress).length;
  const totalLevelsCompleted = Object.values(userData.languageProgress)
    .reduce((sum, progress) => sum + (progress.unlockedLevels - 1), 0);

  const achievements = [
    {
      id: 'first-lesson',
      name: 'Premier pas',
      description: 'Terminer votre première leçon',
      icon: '🎯',
      unlocked: userData.totalXP > 0
    },
    {
      id: 'streak-3',
      name: 'Régularité',
      description: '3 jours consécutifs',
      icon: '🔥',
      unlocked: userData.streak >= 3
    },
    {
      id: 'xp-500',
      name: 'Studieux',
      description: 'Gagner 500 XP',
      icon: '⭐',
      unlocked: userData.totalXP >= 500
    },
    {
      id: 'multilingual',
      name: 'Polyglotte',
      description: 'Apprendre 3 langues',
      icon: '🌍',
      unlocked: totalLanguages >= 3
    },
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      description: 'Terminer 10 niveaux',
      icon: '🏆',
      unlocked: totalLevelsCompleted >= 10
    },
    {
      id: 'dedicated',
      name: 'Dévoué',
      description: '7 jours de série',
      icon: '💎',
      unlocked: userData.streak >= 7
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg mr-4 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            } transition-colors`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* User Info Card */}
      <div className={`rounded-2xl p-8 mb-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          
          {/* User Stats */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">{user?.username}</h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Membre depuis {user ? new Date(user.registrationDate).toLocaleDateString() : 'Unknown'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {userData.totalXP}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">XP Total</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {calculateLevel(userData.totalXP)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Niveau</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {userData.streak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Série</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalLanguages}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Langues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Progression vers le niveau {calculateLevel(userData.totalXP) + 1}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getXPForNextLevel(userData.totalXP)} XP restants
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((userData.totalXP % 1000) / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Language Progress */}
      <div className={`rounded-2xl p-6 mb-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Progression par langue
        </h2>
        
        {Object.keys(userData.languageProgress).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(userData.languageProgress).map(([langCode, progress]) => (
              <div key={langCode} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {langCode.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {langCode === 'en' ? 'Anglais' : 
                       langCode === 'es' ? 'Espagnol' : 
                       langCode === 'fr' ? 'Français' : 
                       langCode === 'de' ? 'Allemand' : 'Langue'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {progress.unlockedLevels - 1} niveaux terminés • {progress.xp} XP
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (progress.xp / 1000) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Niveau {Math.floor(progress.xp / 100) + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Commencez à apprendre une langue pour voir votre progression ici !
            </p>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className={`rounded-2xl p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          Succès ({unlockedAchievements.length}/{achievements.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? `border-green-500 ${
                      darkMode ? 'bg-green-900/20' : 'bg-green-50'
                    }`
                  : `border-gray-300 dark:border-gray-600 ${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    } opacity-60`
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h3 className={`font-semibold ${
                    achievement.unlocked 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm ${
                    achievement.unlocked 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
              
              {achievement.unlocked && (
                <div className="mt-2 flex justify-end">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                    Débloqué ✓
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;