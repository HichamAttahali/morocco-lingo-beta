import React from 'react';
import { ArrowLeft, Lock, Star, Trophy, Play } from 'lucide-react';
import { Language, UserData } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface LevelSelectionProps {
  language: Language;
  userData: UserData;
  onLevelSelect: (level: number) => void;
  onBack: () => void;
}

const LevelSelection: React.FC<LevelSelectionProps> = ({
  language,
  userData,
  onLevelSelect,
  onBack
}) => {
  const { darkMode } = useTheme();
  
  const progress = userData.languageProgress[language.code];
  const unlockedLevels = progress?.unlockedLevels || 1;
  
  const levels = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Niveau ${i + 1}`,
    description: getLevelDescription(i + 1),
    isUnlocked: i + 1 <= unlockedLevels,
    isCompleted: progress?.completedLessons?.includes(`level-${i + 1}`) || false,
    requiredXP: i * 100,
    difficulty: i < 3 ? 'Facile' : i < 7 ? 'Moyen' : 'Difficile'
  }));

  function getLevelDescription(level: number): string {
    const descriptions = [
      'Bases : Salutations et présentations',
      'Famille et relations',
      'Nourriture et boissons',
      'Vêtements et couleurs',
      'Transport et directions',
      'Travail et professions',
      'Loisirs et activités',
      'Santé et corps humain',
      'Voyages et culture',
      'Conversations avancées'
    ];
    return descriptions[level - 1] || 'Niveau avancé';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="flex items-center space-x-4">
          <span className="text-5xl">{language.flag}</span>
          <div>
            <h1 className="text-3xl font-bold">{language.name}</h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choisissez votre niveau • {progress?.xp || 0} XP
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className={`rounded-2xl p-6 mb-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Progression générale</h2>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">{progress?.xp || 0} XP</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, ((progress?.xp || 0) / 1000) * 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Niveaux débloqués : {unlockedLevels}/10</span>
          <span>{1000 - ((progress?.xp || 0) % 1000)} XP pour le prochain niveau</span>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`relative rounded-2xl p-6 transition-all duration-200 shadow-lg ${
              level.isUnlocked
                ? `cursor-pointer hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-50'
                  }`
                : `${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} cursor-not-allowed opacity-60`
            } ${level.isCompleted ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => level.isUnlocked && onLevelSelect(level.id - 1)}
          >
            {/* Lock Icon for Locked Levels */}
            {!level.isUnlocked && (
              <div className="absolute top-4 right-4">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            )}

            {/* Completed Badge */}
            {level.isCompleted && (
              <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded-full">
                <Trophy className="w-4 h-4" />
              </div>
            )}

            {/* Level Content */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{level.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  level.difficulty === 'Facile'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : level.difficulty === 'Moyen'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {level.difficulty}
                </span>
              </div>
              
              <p className={`text-sm mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {level.description}
              </p>

              {/* Level Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>+{level.requiredXP} XP</span>
                  </div>
                </div>
                
                {level.isUnlocked && (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <Play className="w-4 h-4" />
                    <span className="font-semibold">
                      {level.isCompleted ? 'Refaire' : 'Commencer'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar for Unlocked Levels */}
            {level.isUnlocked && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    level.isCompleted 
                      ? 'bg-green-500 w-full' 
                      : 'bg-blue-500 w-0'
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className={`mt-8 rounded-2xl p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <h3 className="font-bold mb-2 text-blue-600 dark:text-blue-400">
          💡 Conseils d'apprentissage
        </h3>
        <ul className={`text-sm space-y-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <li>• Terminez chaque niveau pour débloquer le suivant</li>
          <li>• Répétez les niveaux pour améliorer votre score</li>
          <li>• Maintenez votre série quotidienne pour maximiser l'apprentissage</li>
        </ul>
      </div>
    </div>
  );
};

export default LevelSelection;