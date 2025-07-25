import React from 'react';
import { ArrowLeft, Star, Users, TrendingUp } from 'lucide-react';
import { Language, UserData } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const languages: Language[] = [
  { code: 'en', name: 'Anglais', flag: '🇬🇧', nativeName: 'English' },
  { code: 'es', name: 'Espagnol', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'Allemand', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italien', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portugais', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ru', name: 'Russe', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabe', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinois', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', name: 'Japonais', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Coréen', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'nl', name: 'Néerlandais', flag: '🇳🇱', nativeName: 'Nederlands' }
];

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
  onBack: () => void;
  userData: UserData;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ 
  onLanguageSelect, 
  onBack, 
  userData 
}) => {
  const { darkMode } = useTheme();

  const getLanguageProgress = (langCode: string) => {
    return userData.languageProgress[langCode];
  };

  const getPopularityScore = (langCode: string) => {
    const scores: Record<string, number> = {
      'en': 95, 'es': 88, 'fr': 82, 'de': 78, 'it': 75,
      'pt': 72, 'ru': 68, 'ar': 65, 'zh': 92, 'ja': 70,
      'ko': 68, 'nl': 62
    };
    return scores[langCode] || 60;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
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
        <div>
          <h1 className="text-3xl font-bold mb-2">Choisissez une langue</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Quelle langue souhaitez-vous apprendre aujourd'hui ?
          </p>
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {languages.map((language) => {
          const progress = getLanguageProgress(language.code);
          const popularity = getPopularityScore(language.code);
          const isStarted = !!progress;

          return (
            <div
              key={language.code}
              onClick={() => onLanguageSelect(language)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-200 hover:scale-105 shadow-lg ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              } ${isStarted ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Language Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{language.flag}</span>
                  <div>
                    <h3 className="text-xl font-bold">{language.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {language.nativeName}
                    </p>
                  </div>
                </div>
                
                {isStarted && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                    En cours
                  </div>
                )}
              </div>

              {/* Progress */}
              {isStarted && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progression</span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      {progress.xp} XP
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (progress.xp % 1000) / 10)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Niveau {progress.unlockedLevels - 1} • {progress.unlockedLevels - 1} leçons terminées
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {popularity}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Populaire
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">
                    {isStarted ? 'Continuer' : 'Commencer'}
                  </span>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="mt-4 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl'].includes(language.code)
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : ['ru', 'ar', 'zh', 'ja', 'ko'].includes(language.code)
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {['en', 'es', 'fr', 'de', 'it', 'pt', 'nl'].includes(language.code)
                    ? 'Facile'
                    : ['ru', 'ar', 'zh', 'ja', 'ko'].includes(language.code)
                    ? 'Difficile'
                    : 'Moyen'
                  }
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className={`mt-12 rounded-2xl p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          💡 Conseils pour choisir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Pour les débutants :</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Commencez par l'anglais ou l'espagnol, langues plus accessibles avec de nombreuses ressources.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Pour les aventuriers :</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Tentez le chinois, le japonais ou l'arabe pour un défi stimulant !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;